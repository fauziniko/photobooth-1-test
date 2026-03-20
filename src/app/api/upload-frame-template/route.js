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

const normalizeTemplateName = value =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

const toFiniteNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizePhotoSlots = value => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 12)
    .map(slot => {
      if (!slot || typeof slot !== 'object') return null;
      const x = toFiniteNumber(slot.x, NaN);
      const y = toFiniteNumber(slot.y, NaN);
      const width = toFiniteNumber(slot.width, NaN);
      const height = toFiniteNumber(slot.height, NaN);
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
        return null;
      }

      return {
        x: Math.max(0, Math.round(x)),
        y: Math.max(0, Math.round(y)),
        width: Math.max(1, Math.round(width)),
        height: Math.max(1, Math.round(height)),
      };
    })
    .filter(Boolean);
};

const normalizeTemplateSettings = value => {
  if (!value || typeof value !== 'object') return null;

  const canvasWidth = Math.max(1, Math.round(toFiniteNumber(value.canvasWidth, 0)));
  const canvasHeight = Math.max(1, Math.round(toFiniteNumber(value.canvasHeight, 0)));

  if (!canvasWidth || !canvasHeight) return null;

  return {
    canvasWidth,
    canvasHeight,
    padding: Math.max(0, Math.round(toFiniteNumber(value.padding, 20))),
    gap: Math.max(0, Math.round(toFiniteNumber(value.gap, 8))),
    bottomSpace: Math.max(0, Math.round(toFiniteNumber(value.bottomSpace, 0))),
    frameBorderRadius: Math.max(0, Math.round(toFiniteNumber(value.frameBorderRadius, 0))),
    photoBorderRadius: Math.max(0, Math.round(toFiniteNumber(value.photoBorderRadius, 0))),
    photoWidth: Math.max(1, Math.round(toFiniteNumber(value.photoWidth, 240))),
    photoHeight: Math.max(1, Math.round(toFiniteNumber(value.photoHeight, 180))),
    slotCount: Math.max(1, Math.round(toFiniteNumber(value.slotCount, 4))),
    photoSlots: normalizePhotoSlots(value.photoSlots),
  };
};

export async function GET() {
  try {
    const dataStream = await minioClient.getObject(BUCKET, 'templates/templates.json');
    const chunks = [];
    for await (const chunk of dataStream) chunks.push(chunk);
    const templates = JSON.parse(Buffer.concat(chunks).toString());
    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ templates: [] });
  }
}

export async function POST(req) {
  // Check if user is admin
  const session = await auth();
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' }, 
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const frameFile = formData.get('frame');
  const stickerFile = formData.get('sticker');
  const rawSettings = formData.get('settings');
  const requestedName = formData.get('name');
  const name = normalizeTemplateName(requestedName) || `template-${Date.now()}`;

  let settings = null;
  if (typeof rawSettings === 'string' && rawSettings.trim()) {
    try {
      settings = normalizeTemplateSettings(JSON.parse(rawSettings));
    } catch {
      settings = null;
    }
  }

  if (!frameFile || !stickerFile) {
    return NextResponse.json({ error: 'Both files required' }, { status: 400 });
  }
  if (frameFile.type !== 'image/png' || stickerFile.type !== 'image/png') {
    return NextResponse.json({ error: 'Only PNG allowed' }, { status: 400 });
  }

  const frameBuffer = Buffer.from(await frameFile.arrayBuffer());
  const stickerBuffer = Buffer.from(await stickerFile.arrayBuffer());

  // Pastikan bucket ada
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) await minioClient.makeBucket(BUCKET);

  const framePath = `templates/${name}/frame.png`;
  const stickerPath = `templates/${name}/sticker.png`;
  const metaPath = `templates/${name}/meta.json`;

  await minioClient.putObject(BUCKET, framePath, frameBuffer, { 'Content-Type': 'image/png' });
  await minioClient.putObject(BUCKET, stickerPath, stickerBuffer, { 'Content-Type': 'image/png' });
  if (settings) {
    await minioClient.putObject(
      BUCKET,
      metaPath,
      Buffer.from(JSON.stringify({ settings }), 'utf-8'),
      { 'Content-Type': 'application/json' }
    );
  }

  const endpoint = process.env.MINIO_ENDPOINT;
  const frameUrl = `https://${endpoint}/${BUCKET}/${framePath}`;
  const stickerUrl = `https://${endpoint}/${BUCKET}/${stickerPath}`;

  return NextResponse.json({ frameUrl, stickerUrl, name, settings });
}