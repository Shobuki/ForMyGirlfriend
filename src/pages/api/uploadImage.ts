import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

export const config = {
  api: { bodyParser: false },
};

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const buffers: Uint8Array[] = [];
  for await (const chunk of req) buffers.push(chunk);
  const bodyBuffer = Buffer.concat(buffers);

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!folderId || !serviceAccountJson) {
    return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID or GOOGLE_SERVICE_ACCOUNT_JSON in env' });
  }

  let credentials: any;
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch {
    return res.status(500).json({ error: 'Invalid GOOGLE_SERVICE_ACCOUNT_JSON in env' });
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: `selfie_${Date.now()}.jpg`,
    parents: [folderId],
  };

  const media = {
    mimeType: 'image/jpeg',
    body: bufferToStream(bodyBuffer),
  };

  try {
    const uploadRes = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
    });
    return res.status(200).json({ fileId: uploadRes.data.id });
  } catch (error: any) {
    console.error('Upload failed:', error.message);
    return res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
}
