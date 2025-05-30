import { NextResponse } from 'next/server';
import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET = process.env.MINIO_BUCKET;

export async function POST(req) {
  const formData = await req.formData();
  const frame = formData.get('frame');
  const sticker = formData.get('sticker');
  if (!frame || !sticker) {
    return NextResponse.json({ error: 'Both files are required' }, { status: 400 });
  }
  if (frame.type !== 'image/png' || sticker.type !== 'image/png') {
    return NextResponse.json({ error: 'Only PNG files allowed' }, { status: 400 });
  }

  // Nama template dari timestamp
  const templateName = `${Date.now()}`;
  const folder = `templates/${templateName}/`;

  // Upload frame
  const frameBuffer = Buffer.from(await frame.arrayBuffer());
  await minioClient.putObject(BUCKET, `${folder}frame.png`, frameBuffer, { 'Content-Type': 'image/png' });

  // Upload sticker
  const stickerBuffer = Buffer.from(await sticker.arrayBuffer());
  await minioClient.putObject(BUCKET, `${folder}sticker.png`, stickerBuffer, { 'Content-Type': 'image/png' });

  const endpoint = process.env.MINIO_ENDPOINT;
  return NextResponse.json({
    name: templateName,
    frameUrl: `https://${endpoint}/${BUCKET}/${folder}frame.png`,
    stickerUrl: `https://${endpoint}/${BUCKET}/${folder}sticker.png`,
  });
}