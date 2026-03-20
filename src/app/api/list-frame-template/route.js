import { NextResponse } from 'next/server';
import { minioClient, BUCKET } from '../minio';

const readTemplateMeta = async objectName => {
  try {
    const dataStream = await minioClient.getObject(BUCKET, objectName);
    const chunks = [];
    for await (const chunk of dataStream) chunks.push(chunk);
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    return parsed?.settings ?? null;
  } catch {
    return null;
  }
};

export async function GET() {
  const templates = [];
  const stream = minioClient.listObjectsV2(BUCKET, 'templates/', true);
  const map = {};

  for await (const obj of stream) {
    const mediaMatch = obj.name.match(/^templates\/([^/]+)\/(frame|sticker)\.png$/);
    if (mediaMatch) {
      const [ , templateName, type ] = mediaMatch;
      if (!map[templateName]) map[templateName] = { name: templateName };
      map[templateName][`${type}Url`] = `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${obj.name}`;
      continue;
    }

    const metaMatch = obj.name.match(/^templates\/([^/]+)\/meta\.json$/);
    if (metaMatch) {
      const [ , templateName ] = metaMatch;
      if (!map[templateName]) map[templateName] = { name: templateName };
      map[templateName].metaPath = obj.name;
    }
  }

  const orderedTemplates = Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  for (const tpl of orderedTemplates) {
    if (tpl.metaPath) {
      tpl.settings = await readTemplateMeta(tpl.metaPath);
    }
    delete tpl.metaPath;
    if (tpl.frameUrl && tpl.stickerUrl) templates.push(tpl);
  }

  return NextResponse.json({ templates });
}