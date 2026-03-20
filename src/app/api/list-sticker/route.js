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
  const stickerItems = [];
  const stream = minioClient.listObjectsV2(BUCKET, STICKER_FOLDER, true);

  try {
    for await (const obj of stream) {
      if (!obj?.name) continue;

      const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(obj.name);
      if (!isImage) continue;

      const url = `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${obj.name}`;
      const rawName = obj.name.split('/').pop() || obj.name;
      const name = rawName.replace(/\.[^.]+$/, '');

      stickerItems.push({
        name,
        url,
        objectName: obj.name,
      });
    }

    return NextResponse.json({
      stickers: stickerItems.map(item => item.url),
      stickerItems,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}