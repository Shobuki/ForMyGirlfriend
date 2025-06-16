import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';
import stream from 'stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, essay } = req.body;
  if (!name || !essay) {
    return res.status(400).json({ error: 'Missing name or essay' });
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!folderId || !serviceAccountJson) {
    return res.status(500).json({ error: 'Missing GOOGLE_DRIVE_FOLDER_ID or GOOGLE_SERVICE_ACCOUNT_JSON in env' });
  }

  // Parse JSON dari ENV, pastikan benar!
 let credentials: any;
try {
  credentials = JSON.parse(serviceAccountJson || "");
} catch {
  return res.status(500).json({ error: 'Invalid GOOGLE_SERVICE_ACCOUNT_JSON in ENV' });
}

const auth = new google.auth.GoogleAuth({
  credentials,
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
    return res.status(500).json({ error: 'Upload essay gagal: ' + err.message });
  }
}
