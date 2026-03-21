import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { Message } from '@/services/api/conversationApiService';
import formidable from 'formidable';
import OpenAI from 'openai';
import { supabase, supabaseAdmin, TABLES } from '@/lib/supabase';
import { getUserId } from '@/utils/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseFormData = async (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

const parseJsonBody = async (req: NextApiRequest): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    throw new Error('Invalid JSON body');
  }
};

interface ConversationRow {
  id: string;
  title: string | null;
  scenario: string | null;
  user_id: string;
}

async function generateAssistantReply(content: string, scenario?: string | null): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return 'Merci pour votre message. Continuez la conversation en francais et je vous corrigerai si besoin.';
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: `You are a French language tutor. Keep responses concise and conversational. ${scenario ? `Scenario: ${scenario}.` : ''}`
      },
      {
        role: 'user',
        content
      }
    ]
  });

  return completion.choices[0]?.message?.content?.trim() || 'Pouvez-vous reformuler votre phrase ?';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Message>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        message: 'Method not allowed'
      }
    });
  }

  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }

    let conversationId = '';
    let content = '';

    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      const { fields } = await parseFormData(req);
      conversationId = Array.isArray(fields.conversationId) ? fields.conversationId[0] || '' : (fields.conversationId || '');
      content = Array.isArray(fields.content) ? fields.content[0] || '' : (fields.content || '');
    } else if (contentType.includes('application/json')) {
      const body = await parseJsonBody(req) as { conversationId?: string; content?: string };
      conversationId = body.conversationId || '';
      content = body.content || '';
    } else {
      return res.status(415).json({
        success: false,
        error: {
          message: 'Unsupported content type'
        }
      });
    }

    if (!conversationId || !content) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Conversation ID and content are required'
        }
      });
    }

    const db = supabaseAdmin ?? supabase;

    const { data: conversation, error: conversationError } = await db
      .from(TABLES.CONVERSATIONS)
      .select('id,title,scenario,user_id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (conversationError || !conversation) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Conversation not found'
        }
      });
    }

    const { error: userMessageError } = await db
      .from(TABLES.MESSAGES)
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content
      });

    if (userMessageError) {
      throw new Error(`Failed to save user message: ${userMessageError.message}`);
    }

    const assistantContent = await generateAssistantReply(content, (conversation as ConversationRow).scenario);

    const { data: assistantMessage, error: assistantMessageError } = await db
      .from(TABLES.MESSAGES)
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantContent
      })
      .select('id,conversation_id,role,content,created_at')
      .single();

    if (assistantMessageError || !assistantMessage) {
      throw new Error(`Failed to save assistant message: ${assistantMessageError?.message || 'Unknown error'}`);
    }

    const { error: updateConversationError } = await db
      .from(TABLES.CONVERSATIONS)
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (updateConversationError) {
      throw new Error(`Failed to update conversation timestamp: ${updateConversationError.message}`);
    }

    const response = {
      id: assistantMessage.id,
      conversationId: assistantMessage.conversation_id,
      role: assistantMessage.role,
      content: assistantMessage.content,
      createdAt: assistantMessage.created_at
    };

    return res.status(200).json({
      success: true,
      data: response,
      message: response
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error'
      }
    });
  }
}
