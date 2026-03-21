import type { NextApiRequest, NextApiResponse } from 'next';
import { getOpenAIClient } from '../../../utils/openaiClient';
import { authMiddleware } from '@/utils/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: { message: 'Text is required' }
      });
    }

    const sourceLang = sourceLanguage === 'auto' || !sourceLanguage ? 'auto-detect' : sourceLanguage === 'fr' ? 'French' : 'English';
    const targetLang = targetLanguage === 'fr' ? 'French' : 'English';

    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the given text ${sourceLang === 'auto-detect' ? '' : `from ${sourceLang} `}to ${targetLang}. Return ONLY a JSON object with this structure:
{
  "translatedText": "the translated text",
  "detectedLanguage": "en or fr",
  "confidence": 0.95
}
Return ONLY the JSON, no extra text.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content || '';
    let result;
    try {
      // Strip markdown fences if present
      let jsonStr = content.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      }
      result = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, use the raw text as the translation.
      // Heuristic: if text contains common French characters/words, it's likely French.
      const frenchPattern = /[àâæçéèêëïîôœùûü]|(?:^|\s)(?:le|la|les|un|une|des|je|tu|il|nous|vous|ils|est|sont|avec|dans|pour|sur)\s/i;
      const detectedLang = sourceLanguage === 'auto'
        ? (frenchPattern.test(text) ? 'fr' : 'en')
        : sourceLanguage;
      result = {
        translatedText: content.trim(),
        detectedLanguage: detectedLang,
        confidence: 0.7
      };
    }

    return res.status(200).json({
      success: true,
      data: result,
      ...result
    });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to translate text' }
    });
  }
}

export default authMiddleware(handler);
