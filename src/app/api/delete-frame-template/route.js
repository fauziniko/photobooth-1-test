import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { minioClient, BUCKET } from '../minio';

const sanitizeName = value => {
  const normalized = String(value || '').trim();

  if (!normalized) return '';
  if (normalized.includes('/') || normalized.includes('..')) return '';

  return normalized;
};

export async function DELETE(request) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const templateName = sanitizeName(searchParams.get('name'));

  if (!templateName) {
    return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
  }

  const prefix = `templates/${templateName}/`;

  try {
    const stream = minioClient.listObjectsV2(BUCKET, prefix, true);
    const objectNames = [];

    for await (const obj of stream) {
      if (obj?.name) {
        objectNames.push(obj.name);
      }
    }

    if (objectNames.length === 0) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    for (const objectName of objectNames) {
      await minioClient.removeObject(BUCKET, objectName);
    }

    return NextResponse.json({ success: true, deleted: objectNames.length, templateName });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete frame template' },
      { status: 500 }
    );
  }
}
