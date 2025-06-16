import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import fs from 'fs';

// --- BACA SERVICE ACCOUNT DARI ENV (file atau base64) ---
function getServiceAccountPath(): string | undefined {
  // Cek BASE64 dulu (Vercel production rekomendasi)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    const tmpPath = '/tmp/service-account.json';
    if (!fs.existsSync(tmpPath)) {
      fs.writeFileSync(
        tmpPath,
        Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, 'base64').toString('utf8')
      );
    }
    return tmpPath;
  }
  // Fallback ke file path dari env (lokal development)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  }
  return undefined;
}

export const config = {
  api: { bodyParser: false }
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
  if (!folderId) return res.status(500).json({ error: 'Missing folder ID' });

  const keyFile = getServiceAccountPath();
  if (!keyFile || !fs.existsSync(keyFile)) {
    return res.status(500).json({ error: 'Service Account JSON tidak ditemukan atau belum diset' });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile,
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
