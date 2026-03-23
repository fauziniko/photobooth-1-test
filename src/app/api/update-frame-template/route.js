import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { minioClient, BUCKET } from '../minio';

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

const listObjectNames = async prefix => {
  const names = [];
  const stream = minioClient.listObjectsV2(BUCKET, prefix, true);
  for await (const obj of stream) {
    if (obj?.name) names.push(obj.name);
  }
  return names;
};

const buildUrl = objectName => `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${objectName}`;

export async function PATCH(request) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const currentName = normalizeTemplateName(formData.get('currentName'));
    const requestedName = normalizeTemplateName(formData.get('name'));

    if (!currentName) {
      return NextResponse.json({ error: 'Current template name is required.' }, { status: 400 });
    }

    const nextName = requestedName || currentName;
    const sourcePrefix = `templates/${currentName}/`;
    const targetPrefix = `templates/${nextName}/`;

    const sourceObjects = await listObjectNames(sourcePrefix);
    if (sourceObjects.length === 0) {
      return NextResponse.json({ error: 'Template not found.' }, { status: 404 });
    }

    if (nextName !== currentName) {
      const targetObjects = await listObjectNames(targetPrefix);
      if (targetObjects.length > 0) {
        return NextResponse.json({ error: 'New template name is already in use.' }, { status: 409 });
      }

      for (const sourceObject of sourceObjects) {
        const suffix = sourceObject.slice(sourcePrefix.length);
        const targetObject = `${targetPrefix}${suffix}`;
        await minioClient.copyObject(BUCKET, targetObject, `/${BUCKET}/${sourceObject}`);
      }
    }

    const frameFile = formData.get('frame');
    const stickerFile = formData.get('sticker');
    const rawSettings = formData.get('settings');

    const activePrefix = nextName === currentName ? sourcePrefix : targetPrefix;
    const framePath = `${activePrefix}frame.png`;
    const stickerPath = `${activePrefix}sticker.png`;
    const metaPath = `${activePrefix}meta.json`;

    if (frameFile && typeof frameFile.arrayBuffer === 'function') {
      if (frameFile.type !== 'image/png') {
        return NextResponse.json({ error: 'Frame file must be PNG.' }, { status: 400 });
      }
      const frameBuffer = Buffer.from(await frameFile.arrayBuffer());
      await minioClient.putObject(BUCKET, framePath, frameBuffer, { 'Content-Type': 'image/png' });
    }

    if (stickerFile && typeof stickerFile.arrayBuffer === 'function') {
      if (stickerFile.type !== 'image/png') {
        return NextResponse.json({ error: 'Sticker file must be PNG.' }, { status: 400 });
      }
      const stickerBuffer = Buffer.from(await stickerFile.arrayBuffer());
      await minioClient.putObject(BUCKET, stickerPath, stickerBuffer, { 'Content-Type': 'image/png' });
    }

    if (typeof rawSettings === 'string' && rawSettings.trim()) {
      let parsed;
      try {
        parsed = JSON.parse(rawSettings);
      } catch {
        return NextResponse.json({ error: 'Invalid settings format.' }, { status: 400 });
      }

      const normalized = normalizeTemplateSettings(parsed);
      if (!normalized) {
        return NextResponse.json({ error: 'Invalid settings values.' }, { status: 400 });
      }

      await minioClient.putObject(
        BUCKET,
        metaPath,
        Buffer.from(JSON.stringify({ settings: normalized }), 'utf-8'),
        { 'Content-Type': 'application/json' }
      );
    }

    if (nextName !== currentName) {
      for (const sourceObject of sourceObjects) {
        await minioClient.removeObject(BUCKET, sourceObject);
      }
    }

    return NextResponse.json({
      success: true,
      previousName: currentName,
      template: {
        name: nextName,
        frameUrl: buildUrl(framePath),
        stickerUrl: buildUrl(stickerPath),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update frame template.' },
      { status: 500 }
    );
  }
}