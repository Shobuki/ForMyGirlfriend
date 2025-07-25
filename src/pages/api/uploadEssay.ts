import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import stream from 'stream';
import fs from 'fs';
import path from 'path';

function getServiceAccountPath(): string {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    const tmpPath = '/tmp/service-account.json';
    if (!fs.existsSync(tmpPath)) {
      fs.writeFileSync(
        tmpPath,
        Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64!, 'base64').toString('utf8')
      );
    }
    return tmpPath;
  }
  // fallback ke env local file
  return process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, essay } = req.body;
  if (!name || !essay) {
    return res.status(400).json({ error: 'Missing name or essay' });
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID in env' });
  }

  // --- Perbaiki di sini!
  const keyFile = getServiceAccountPath();

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: `${name}_essay_${Date.now()}.txt`,
    parents: [folderId],
  };

  const essayStream = new stream.Readable();
  essayStream.push(essay);
  essayStream.push(null);

  const media = {
    mimeType: 'text/plain',
    body: essayStream,
  };

  try {
    const result = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });

    return res.status(200).json({ fileId: result.data.id });
  } catch (err: any) {
    console.error('Upload essay failed:', err.message);
    return res.status(500).json({ error: 'Upload essay gagal' });
  }
}
