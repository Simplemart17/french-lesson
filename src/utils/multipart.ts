import type { NextApiRequest } from 'next';
import formidable from 'formidable';
import os from 'os';

/**
 * Shared multipart parsing for audio-upload API routes.
 * Any change to upload limits or temp-dir handling belongs here so every
 * audio endpoint stays in sync.
 */
export const parseMultipartForm = async (req: NextApiRequest) => {
  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    const form = formidable({
      uploadDir: os.tmpdir(),
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024 // Whisper's upload limit
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

/** First value of a formidable field, or ''. */
export const formField = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) || '';

/** First file of a formidable file field, or null. */
export const formFile = (value: formidable.File | formidable.File[] | undefined): formidable.File | null => {
  const file = Array.isArray(value) ? value[0] : value;
  return file && file.filepath ? file : null;
};
