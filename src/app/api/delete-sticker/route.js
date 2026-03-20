import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { minioClient, BUCKET } from '../minio';

const sanitizeObjectName = value =>
  String(value || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/\.\./g, '');

export async function DELETE(request) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized. Admin access required.' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const objectName = sanitizeObjectName(searchParams.get('objectName'));

  if (!objectName) {
    return NextResponse.json({ error: 'Object name is required' }, { status: 400 });
  }

  if (!objectName.startsWith('sticker/')) {
    return NextResponse.json(
      { error: 'Invalid object path. Only sticker files are allowed.' },
      { status: 400 }
    );
  }

  try {
    await minioClient.removeObject(BUCKET, objectName);
    return NextResponse.json({ success: true, objectName });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete sticker' },
      { status: 500 }
    );
  }
}
