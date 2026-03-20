import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type GalleryMetadata = {
  userId?: string;
  title?: string;
  layout?: number;
  filter?: string;
  previewDataUrl?: string;
  stripDataUrl?: string;
  gifDataUrl?: string;
  liveVideoDataUrl?: string;
  photoFrames?: string[];
  livePhotos?: string[];
};

const getOwnerId = (metadata: unknown) => {
  const parsed = (metadata ?? {}) as GalleryMetadata;
  return typeof parsed.userId === 'string' ? parsed.userId : null;
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const row = await prisma.photoStrip.findUnique({
      where: { id },
    });

    if (!row) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    const metadata = (row.metadata ?? {}) as GalleryMetadata;

    return NextResponse.json({
      item: {
        id: row.id,
        createdAt: row.createdAt,
        imageUrl: row.imageUrl,
        title: typeof metadata.title === 'string' ? metadata.title : 'Photo Strip',
        layout: Number.isFinite(metadata.layout) ? Number(metadata.layout) : 4,
        filter: typeof metadata.filter === 'string' ? metadata.filter : 'none',
        previewDataUrl: typeof metadata.previewDataUrl === 'string' ? metadata.previewDataUrl : null,
        stripDataUrl: typeof metadata.stripDataUrl === 'string' ? metadata.stripDataUrl : null,
        gifDataUrl: typeof metadata.gifDataUrl === 'string' ? metadata.gifDataUrl : null,
        liveVideoDataUrl: typeof metadata.liveVideoDataUrl === 'string' ? metadata.liveVideoDataUrl : null,
        photoFrames: Array.isArray(metadata.photoFrames)
          ? metadata.photoFrames.filter((v): v is string => typeof v === 'string')
          : [],
        livePhotos: Array.isArray(metadata.livePhotos)
          ? metadata.livePhotos.filter((v): v is string => typeof v === 'string')
          : [],
      },
    });
  } catch (error) {
    console.error('Failed to fetch gallery item:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery item' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const nextTitle = typeof body?.title === 'string' ? body.title.trim() : '';

    if (!nextTitle) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const existing = await prisma.photoStrip.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    if (getOwnerId(existing.metadata) !== userId) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    const existingMetadata = (existing.metadata ?? {}) as Record<string, unknown>;
    const updated = await prisma.photoStrip.update({
      where: { id },
      data: {
        metadata: {
          ...existingMetadata,
          title: nextTitle,
        },
      },
    });

    return NextResponse.json({
      item: {
        id: updated.id,
        title: nextTitle,
      },
    });
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const existing = await prisma.photoStrip.findUnique({ where: { id } });
    if (!existing || getOwnerId(existing.metadata) !== userId) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    await prisma.photoStrip.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
