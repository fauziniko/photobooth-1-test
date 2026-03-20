import { NextResponse } from 'next/server';
import { Client } from 'minio';
import { auth } from '@/lib/auth';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET = process.env.MINIO_BUCKET;
const STICKER_FOLDER = 'sticker/';

const sanitizeValue = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getFileExtension = (file) => {
  const originalName = String(file?.name || '');
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  if (extMatch) {
    return `.${extMatch[1].toLowerCase()}`;
  }

  const mimeType = String(file?.type || '').toLowerCase();
  if (mimeType.includes('png')) return '.png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return '.jpg';
  if (mimeType.includes('gif')) return '.gif';
  if (mimeType.includes('webp')) return '.webp';
  return '.png';
};

export async function POST(req) {
  try {
    // Check if user is admin
    const session = await auth();
    const role = String(session?.user?.role || '').toUpperCase();

    if (!session || role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    if (!BUCKET) {
      return NextResponse.json({ error: 'Konfigurasi bucket MinIO belum diatur.' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') || formData.get('sticker');

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'File sticker tidak ditemukan.' }, { status: 400 });
    }

    const mimeType = String(file.type || '').toLowerCase();
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ error: 'File harus berupa gambar.' }, { status: 400 });
    }

    const requestedName = sanitizeValue(formData.get('name')) || `sticker-${Date.now()}`;
    const category = sanitizeValue(formData.get('category')) || 'default';
    const extension = getFileExtension(file);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'File sticker kosong.' }, { status: 400 });
    }

    // Generate unique filename
    const filename = `${requestedName}-${Date.now()}${extension}`;
    const minioPath = `${STICKER_FOLDER}${category}/${filename}`;

    // Pastikan bucket ada
    const exists = await minioClient.bucketExists(BUCKET);
    if (!exists) {
      await minioClient.makeBucket(BUCKET);
    }

    // Upload ke MinIO
    await minioClient.putObject(BUCKET, minioPath, buffer, {
      'Content-Type': mimeType || 'application/octet-stream',
    });

    // URL public
    const url = `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${minioPath}`;
    return NextResponse.json({
      url,
      stickerUrl: url,
      name: requestedName,
      category,
      objectName: minioPath,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal upload sticker.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}