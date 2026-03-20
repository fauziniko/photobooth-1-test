export type GalleryItem = {
  id: string;
  createdAt: string;
  stripDataUrl: string;
  publicUrl?: string;
  layout: number;
  filter: string;
};

const GALLERY_STORAGE_KEY = 'photobooth-gallery-v1';
const GALLERY_MAX_ITEMS = 40;

const isBrowser = () => typeof window !== 'undefined';

const readGallery = (): GalleryItem[] => {
  if (!isBrowser()) return [];

  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as GalleryItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      item =>
        typeof item?.id === 'string' &&
        typeof item?.createdAt === 'string' &&
        typeof item?.stripDataUrl === 'string'
    );
  } catch {
    return [];
  }
};

const writeGallery = (items: GalleryItem[]) => {
  if (!isBrowser()) return;

  let trimmed = items.slice(0, GALLERY_MAX_ITEMS);

  while (trimmed.length > 0) {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(trimmed));
      window.dispatchEvent(new Event('photobooth-gallery-updated'));
      return;
    } catch {
      // Remove oldest entries progressively until payload fits browser quota.
      trimmed = trimmed.slice(0, trimmed.length - 1);
    }
  }

  localStorage.removeItem(GALLERY_STORAGE_KEY);
  window.dispatchEvent(new Event('photobooth-gallery-updated'));
};

export const getGalleryItems = (): GalleryItem[] => {
  const items = readGallery();
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addGalleryItem = (input: {
  stripDataUrl: string;
  publicUrl?: string;
  layout: number;
  filter: string;
}): GalleryItem => {
  const nextItem: GalleryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
    stripDataUrl: input.stripDataUrl,
    publicUrl: input.publicUrl,
    layout: input.layout,
    filter: input.filter,
  };

  const current = readGallery();
  writeGallery([nextItem, ...current]);
  return nextItem;
};

export const updateGalleryItemPublicUrl = (id: string, publicUrl: string) => {
  const items = readGallery();
  const updated = items.map(item => (item.id === id ? { ...item, publicUrl } : item));
  writeGallery(updated);
};

export const clearGalleryItems = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(GALLERY_STORAGE_KEY);
  window.dispatchEvent(new Event('photobooth-gallery-updated'));
};
