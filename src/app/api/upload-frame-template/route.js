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
  const frameFile = formData.get('frame');
  const stickerFile = formData.get('sticker');
  const name = formData.get('name') || `template_${Date.now()}`;

  if (!frameFile || !stickerFile) {
    return NextResponse.json({ error: 'Both files required' }, { status: 400 });
  }
  if (frameFile.type !== 'image/png' || stickerFile.type !== 'image/png') {
    return NextResponse.json({ error: 'Only PNG allowed' }, { status: 400 });
  }

  const frameBuffer = Buffer.from(await frameFile.arrayBuffer());
  const stickerBuffer = Buffer.from(await stickerFile.arrayBuffer());

  // Pastikan bucket ada
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) await minioClient.makeBucket(BUCKET);

  const framePath = `templates/${name}/frame.png`;
  const stickerPath = `templates/${name}/sticker.png`;

  await minioClient.putObject(BUCKET, framePath, frameBuffer, { 'Content-Type': 'image/png' });
  await minioClient.putObject(BUCKET, stickerPath, stickerBuffer, { 'Content-Type': 'image/png' });

  const endpoint = process.env.MINIO_ENDPOINT;
  const frameUrl = `https://${endpoint}/${BUCKET}/${framePath}`;
  const stickerUrl = `https://${endpoint}/${BUCKET}/${stickerPath}`;

  return NextResponse.json({ frameUrl, stickerUrl, name });
}