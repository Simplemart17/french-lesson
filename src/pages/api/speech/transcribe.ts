import type { NextApiRequest, NextApiResponse } from 'next';
import { createAudioTranscription } from '@/utils/openaiClient';
import { authMiddleware } from '@/utils/authMiddleware';
import fs from 'fs';
import formidable from 'formidable';
import os from 'os';

export const config = {
  api: {
    bodyParser: false, // multipart audio upload
  },
};

const parseForm = async (req: NextApiRequest) => {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  const tempFiles: string[] = [];

  try {
    const { files } = await parseForm(req);
    const audioFile = Array.isArray(files.audio) ? files.audio[0] : files.audio;

    if (!audioFile || !audioFile.filepath) {
      return res.status(400).json({ success: false, error: { message: 'Audio file is required' } });
    }
    tempFiles.push(audioFile.filepath);

    const transcript = (await createAudioTranscription(fs.createReadStream(audioFile.filepath))).trim();

    return res.status(200).json({
      success: true,
      data: { transcript }
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to transcribe audio' }
    });
  } finally {
    for (const filePath of tempFiles) {
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error cleaning up temp file:', err);
      }
    }
  }
}

export default authMiddleware(handler);
