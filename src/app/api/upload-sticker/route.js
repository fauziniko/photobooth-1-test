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
const STICKER_FOLDER = 'sticker/';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate unique filename
  const filename = `${Date.now()}_${file.name}`;
  const minioPath = `${STICKER_FOLDER}${filename}`;

  // Pastikan bucket ada
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
  }

  // Upload ke MinIO
  await minioClient.putObject(BUCKET, minioPath, buffer, {
    'Content-Type': file.type,
  });

  // URL public
  const url = `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${minioPath}`;
  return NextResponse.json({ url, name: file.name });
}