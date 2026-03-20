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

const MAX_METADATA_DATA_URL_LENGTH = 350_000;
const MAX_METADATA_URL_LENGTH = 2048;

const toSafeDataUrl = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  if (!value.startsWith('data:image/')) return undefined;
  if (value.length > MAX_METADATA_DATA_URL_LENGTH) return undefined;
  return value;
};

const toSafePublicUrl = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  if (!/^https?:\/\//i.test(value)) return undefined;
  if (value.length > MAX_METADATA_URL_LENGTH) return undefined;
  return value;
};

const toSafeImageValue = (value: unknown) => {
  const publicUrl = toSafePublicUrl(value);
  if (publicUrl) return publicUrl;
  return toSafeDataUrl(value);
};

const toSafeVideoValue = (value: unknown) => {
  const publicUrl = toSafePublicUrl(value);
  if (publicUrl) return publicUrl;
  if (typeof value !== 'string') return undefined;
  if (!value.startsWith('data:video/')) return undefined;
  if (value.length > MAX_METADATA_DATA_URL_LENGTH) return undefined;
  return value;
};

const toStringList = (value: unknown, maxItems = 8) => {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((v): v is string => typeof v === 'string' && v.length <= MAX_METADATA_DATA_URL_LENGTH)
    .slice(0, maxItems);
};

const toSafeNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await prisma.photoStrip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    const items = rows
      .map(row => {
        const metadata = (row.metadata ?? {}) as GalleryMetadata;
        return {
          row,
          metadata,
        };
      })
      .filter(({ metadata }) => metadata.userId === userId)
      .map(({ row, metadata }) => {
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
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: 'Payload terlalu besar atau format JSON tidak valid. Kirim URL hasil upload, bukan data base64 besar.' },
        { status: 413 }
      );
    }

    const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl : '';

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const layout = toSafeNumber(body?.layout, 4);
    const filter = typeof body?.filter === 'string' ? body.filter : 'none';
    const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'Photo Strip';
    const previewDataUrl = toSafeImageValue(body?.previewDataUrl);
    const stripDataUrl = toSafeImageValue(body?.stripDataUrl);
    const gifDataUrl = toSafeImageValue(body?.gifDataUrl);
    const liveVideoDataUrl = toSafeVideoValue(body?.liveVideoDataUrl);
    const photoFrames = toStringList(body?.photoFrames);
    const livePhotos = toStringList(body?.livePhotos);

    const created = await prisma.photoStrip.create({
      data: {
        imageUrl,
        metadata: {
          userId,
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
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await prisma.photoStrip.findMany({
      select: { id: true, metadata: true },
      take: 1000,
    });

    const ownIds = rows
      .filter(row => {
        const metadata = (row.metadata ?? {}) as GalleryMetadata;
        return metadata.userId === userId;
      })
      .map(row => row.id);

    if (ownIds.length === 0) {
      return NextResponse.json({ ok: true, deleted: 0 });
    }

    const deleted = await prisma.photoStrip.deleteMany({
      where: { id: { in: ownIds } },
    });

    return NextResponse.json({ ok: true, deleted: deleted.count });
  } catch (error) {
    console.error('Failed to clear gallery items:', error);
    return NextResponse.json({ error: 'Failed to clear gallery items' }, { status: 500 });
  }
}
