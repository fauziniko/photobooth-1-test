import { NextResponse } from 'next/server';
import { minioClient, BUCKET } from '../minio';
const FRAME_TEMPLATE_FOLDER = 'frame-templates/';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate unique filename
  const filename = `${Date.now()}_${file.name}`;
  const minioPath = `${FRAME_TEMPLATE_FOLDER}${filename}`;

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