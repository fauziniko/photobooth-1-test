import { NextResponse } from 'next/server';
import { minioClient, BUCKET } from '../minio';

export async function GET() {
  const templates = [];
  const stream = minioClient.listObjectsV2(BUCKET, 'templates/', true);
  const map = {};

  for await (const obj of stream) {
    const match = obj.name.match(/^templates\/([^/]+)\/(frame|sticker)\.png$/);
    if (match) {
      const [ , templateName, type ] = match;
      if (!map[templateName]) map[templateName] = { name: templateName };
      map[templateName][`${type}Url`] = `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${obj.name}`;
    }
  }
  Object.values(map).forEach(tpl => {
    if (tpl.frameUrl && tpl.stickerUrl) templates.push(tpl);
  });
  return NextResponse.json({ templates });
}