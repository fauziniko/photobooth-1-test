import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { minioClient, BUCKET } from '../minio';

const STICKER_PREFIX = 'sticker/';

const sanitizeValue = value =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sanitizeObjectName = value =>
  String(value || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\.\./g, '');

const extractExt = objectName => {
  const match = String(objectName || '').match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0].toLowerCase() : '.png';
};

const buildPublicUrl = objectName => `https://${process.env.MINIO_ENDPOINT}/${BUCKET}/${objectName}`;

const objectExists = async objectName => {
  try {
    await minioClient.statObject(BUCKET, objectName);
    return true;
  } catch {
    return false;
  }
};

const ensureUniqueTargetPath = async basePath => {
  if (!(await objectExists(basePath))) {
    return basePath;
  }

  const dotIndex = basePath.lastIndexOf('.');
  const hasExt = dotIndex > -1;
  const nameOnly = hasExt ? basePath.slice(0, dotIndex) : basePath;
  const ext = hasExt ? basePath.slice(dotIndex) : '';

  let attempt = 1;
  let candidate = `${nameOnly}-${attempt}${ext}`;
  while (await objectExists(candidate)) {
    attempt += 1;
    candidate = `${nameOnly}-${attempt}${ext}`;
  }

  return candidate;
};

export async function PATCH(request) {
  const session = await auth();
  const role = String(session?.user?.role || '').toUpperCase();

  if (!session || role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  if (!BUCKET) {
    return NextResponse.json({ error: 'MinIO bucket configuration is missing.' }, { status: 500 });
  }

  try {
    const payload = await request.json();
    const sourceObjectName = sanitizeObjectName(payload?.objectName);
    const requestedName = sanitizeValue(payload?.name);
    const requestedCategory = sanitizeValue(payload?.category) || 'custom';

    if (!sourceObjectName || !sourceObjectName.startsWith(STICKER_PREFIX)) {
      return NextResponse.json({ error: 'Invalid sticker object path.' }, { status: 400 });
    }

    if (!requestedName) {
      return NextResponse.json({ error: 'Sticker name is required.' }, { status: 400 });
    }

    const exists = await objectExists(sourceObjectName);
    if (!exists) {
      return NextResponse.json({ error: 'Sticker not found.' }, { status: 404 });
    }

    const extension = extractExt(sourceObjectName);
    const rawTarget = `${STICKER_PREFIX}${requestedCategory}/${requestedName}${extension}`;
    const targetObjectName = await ensureUniqueTargetPath(rawTarget);

    if (targetObjectName !== sourceObjectName) {
      await minioClient.copyObject(BUCKET, targetObjectName, `/${BUCKET}/${sourceObjectName}`);
      await minioClient.removeObject(BUCKET, sourceObjectName);
    }

    return NextResponse.json({
      success: true,
      previousObjectName: sourceObjectName,
      item: {
        name: requestedName,
        objectName: targetObjectName,
        url: buildPublicUrl(targetObjectName),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update sticker.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}