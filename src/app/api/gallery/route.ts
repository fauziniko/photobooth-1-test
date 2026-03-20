import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type GalleryMetadata = {
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

const toSafeNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export async function GET() {
  try {
    const rows = await prisma.photoStrip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    const items = rows.map(row => {
      const metadata = (row.metadata ?? {}) as GalleryMetadata;

      return {
        id: row.id,
        createdAt: row.createdAt,
        imageUrl: row.imageUrl,
        title: typeof metadata.title === 'string' ? metadata.title : 'Photo Strip',
        layout: toSafeNumber(metadata.layout, 4),
        filter: typeof metadata.filter === 'string' ? metadata.filter : 'none',
        previewDataUrl: typeof metadata.previewDataUrl === 'string' ? metadata.previewDataUrl : null,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const layout = toSafeNumber(body?.layout, 4);
    const filter = typeof body?.filter === 'string' ? body.filter : 'none';
    const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'Photo Strip';
    const previewDataUrl = typeof body?.previewDataUrl === 'string' ? body.previewDataUrl : undefined;
    const stripDataUrl = typeof body?.stripDataUrl === 'string' ? body.stripDataUrl : undefined;
    const gifDataUrl = typeof body?.gifDataUrl === 'string' ? body.gifDataUrl : undefined;
    const liveVideoDataUrl = typeof body?.liveVideoDataUrl === 'string' ? body.liveVideoDataUrl : undefined;
    const photoFrames = Array.isArray(body?.photoFrames)
      ? (body.photoFrames as unknown[]).filter((v): v is string => typeof v === 'string')
      : undefined;
    const livePhotos = Array.isArray(body?.livePhotos)
      ? (body.livePhotos as unknown[]).filter((v): v is string => typeof v === 'string')
      : undefined;

    const created = await prisma.photoStrip.create({
      data: {
        imageUrl,
        metadata: {
          layout,
          filter,
          title,
          previewDataUrl,
          stripDataUrl,
          gifDataUrl,
          liveVideoDataUrl,
          photoFrames,
          livePhotos,
        },
      },
    });

    return NextResponse.json({
      item: {
        id: created.id,
        createdAt: created.createdAt,
        imageUrl: created.imageUrl,
        title,
        layout,
        filter,
        previewDataUrl: previewDataUrl ?? null,
        stripDataUrl: stripDataUrl ?? null,
        gifDataUrl: gifDataUrl ?? null,
        liveVideoDataUrl: liveVideoDataUrl ?? null,
        photoFrames: photoFrames ?? [],
        livePhotos: livePhotos ?? [],
      },
    });
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.photoStrip.deleteMany();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to clear gallery items:', error);
    return NextResponse.json({ error: 'Failed to clear gallery items' }, { status: 500 });
  }
}
