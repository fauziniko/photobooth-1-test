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
const PHOTO_FOLDER = 'photos/';
const FRAME_FOLDER = 'frames/';
const GIF_FOLDER = 'gifs/';

export async function POST(req) {
  // Mendukung upload foto individual, frame, dan GIF
  const formData = await req.formData();
  const type = formData.get('type'); // 'photo', 'frame', 'gif'
  const file = formData.get('file');
  if (!file || !type) {
    return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let folder, ext;
  if (type === 'photo') {
    folder = PHOTO_FOLDER;
    ext = '.png';
  } else if (type === 'frame') {
    folder = FRAME_FOLDER;
    ext = '.png';
  } else if (type === 'gif') {
    folder = GIF_FOLDER;
    ext = '.gif';
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Generate unique filename
  const filename = `${Date.now()}_${file.name || 'file'}${ext}`;
  const minioPath = `${folder}${filename}`;

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

export async function GET(req) {
  // Query param: type=photo|frame|gif
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  let folder;
  if (type === 'photo') {
    folder = PHOTO_FOLDER;
  } else if (type === 'frame') {
    folder = FRAME_FOLDER;
  } else if (type === 'gif') {
    folder = GIF_FOLDER;
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const files = [];
  const stream = minioClient.listObjectsV2(BUCKET, folder, true);

  return new Promise((resolve, reject) => {
    stream.on('data', obj => {
      if (
        (type === 'photo' && obj.name.endsWith('.png')) ||
        (type === 'frame' && obj.name.endsWith('.png')) ||
        (type === 'gif' && obj.name.endsWith('.gif'))
      ) {
        files.push(
          `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${obj.name}`
        );
      }
    });
    stream.on('end', () => {
      resolve(NextResponse.json({ files }));
    });
    stream.on('error', err => {
      reject(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}