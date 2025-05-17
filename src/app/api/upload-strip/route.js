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
  const { image } = await req.json();
  if (!image) return NextResponse.json({ error: 'No image' }, { status: 400 });

  // Generate unique filename
  const filename = `strip_${Date.now()}.png`;

  // Remove base64 prefix
  const base64Data = image.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  // Pastikan bucket ada
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
  }

  // Upload ke MinIO
  await minioClient.putObject(BUCKET, filename, buffer, {
    'Content-Type': 'image/png',
  });

  // URL public (ubah sesuai config MinIO kamu)
  const url = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET}/${filename}`;

  return NextResponse.json({ url });
}