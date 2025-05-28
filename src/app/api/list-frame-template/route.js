import { NextResponse } from 'next/server';
import { minioClient, BUCKET } from '../minio';
const FRAME_TEMPLATE_FOLDER = 'frame-templates/';

export async function GET() {
  const templates = [];
  const stream = minioClient.listObjectsV2(BUCKET, FRAME_TEMPLATE_FOLDER, true);
  for await (const obj of stream) {
    if (obj.name.endsWith('.png')) {
      templates.push(`https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${obj.name}`);
    }
  }
  return NextResponse.json({ templates });
}