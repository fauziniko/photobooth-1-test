import { NextResponse } from 'next/server';
import { Client } from 'minio';

const STICKER_FOLDER = 'sticker/';

const getMinioConfig = () => {
  const endPoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  const bucket = process.env.MINIO_BUCKET;
  const portRaw = process.env.MINIO_PORT;

  if (!endPoint || !accessKey || !secretKey || !bucket) {
    throw new Error('Missing MinIO configuration. Required: MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET.');
  }

  const parsedPort = Number.parseInt(portRaw || '9000', 10);
  const port = Number.isFinite(parsedPort) ? parsedPort : 9000;

  return {
    bucket,
    client: new Client({
      endPoint,
      port,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey,
      secretKey,
    }),
  };
};

export async function GET() {
  try {
    const { client, bucket } = getMinioConfig();
    const stickerItems = [];
    const stream = client.listObjectsV2(bucket, STICKER_FOLDER, true);

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

    stickerItems.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      stickers: stickerItems.map(item => item.url),
      stickerItems,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}