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

export async function GET() {
  const stickers = [];
  const stream = minioClient.listObjectsV2(BUCKET, STICKER_FOLDER, true);

  return new Promise((resolve, reject) => {
    stream.on('data', obj => {
      if (obj.name.endsWith('.png')) {
        stickers.push(
          `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${obj.name}`
        );
      }
    });
    stream.on('end', () => {
      resolve(NextResponse.json({ stickers }));
    });
    stream.on('error', err => {
      reject(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}

export async function POST() {
  // Implementasi upload frame-sticker di sini jika perlu
  return NextResponse.json({ ok: true });
}