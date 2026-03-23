'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, ImageIcon, Pencil, Save, Trash2, X } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';
import { isIndexedDBSupported, savePhotosToIndexedDB } from '@/lib/indexedDB';
import {
  clearTempLiveVideoUrlFromSessionStorage,
  saveTempLiveVideoUrlToSessionStorage,
  saveTempPhotosToSessionStorage,
} from '@/lib/tempPhotoStorage';

type GalleryApiItem = {
  id: string;
  createdAt: string;
  imageUrl: string;
  title: string;
  layout: number;
  filter: string;
};

type GalleryViewItem = {
  id: string;
  title: string;
  createdAt: string;
  imageSrc: string;
  layout: number;
  filter: string;
};

export default function PhotoGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryViewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    ids: string[];
    title: string;
    message: string;
  }>({
    open: false,
    ids: [],
    title: '',
    message: '',
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  const normalizeEditorImageSource = (value: string): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('data:image/')) return trimmed;
    if (trimmed.startsWith('/api/image-proxy?url=')) return trimmed;
    if (trimmed.startsWith('/')) return trimmed;
    if (trimmed.startsWith('blob:')) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) {
      return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
    }
    return null;
  };

  const fetchDatabaseGallery = useCallback(async (): Promise<GalleryViewItem[]> => {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      if (!res.ok) return [];
      const data = await res.json();
      const rows = Array.isArray(data?.items) ? (data.items as GalleryApiItem[]) : [];

      return rows.map((row) => ({
        id: row.id,
        title: row.title || 'Photo Strip',
        createdAt: row.createdAt,
        imageSrc: row.imageUrl,
        layout: Number.isFinite(row.layout) ? row.layout : 4,
        filter: row.filter || 'none',
      }));
    } catch {
      return [];
    }
  }, []);

  const loadGallery = useCallback(async () => {
    setIsLoading(true);
    const dbItems = await fetchDatabaseGallery();
    setItems(dbItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setIsLoading(false);
  }, [fetchDatabaseGallery]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const requestDeleteItems = (ids: string[], title: string, message: string) => {
    if (ids.length === 0) return;
    setConfirmDelete({
      open: true,
      ids,
      title,
      message,
    });
  };

  const closeDeleteDialog = () => {
    if (confirmLoading) return;
    setConfirmDelete({
      open: false,
      ids: [],
      title: '',
      message: '',
    });
  };

  const confirmDeleteItems = async () => {
    if (confirmDelete.ids.length === 0) {
      closeDeleteDialog();
      return;
    }

    setConfirmLoading(true);
    await Promise.all(confirmDelete.ids.map(id => fetch(`/api/gallery/${id}`, { method: 'DELETE' }).catch(() => null)));
    setSelectedIds(prev => prev.filter(selectedId => !confirmDelete.ids.includes(selectedId)));
    await loadGallery();
    setConfirmLoading(false);
    closeDeleteDialog();
  };

  const handleDeleteItem = (id: string) => {
    requestDeleteItems([id], 'Delete Photo', 'Delete this gallery photo?');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedIds(items.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    requestDeleteItems(
      [...selectedIds],
      'Delete Selected Photos',
      `Delete ${selectedIds.length} selected photos?`
    );
  };

  const startEditTitle = (item: GalleryViewItem) => {
    setEditingId(item.id);
    setTitleDraft(item.title);
  };

  const cancelEditTitle = () => {
    setEditingId(null);
    setTitleDraft('');
  };

  const saveEditTitle = async (id: string) => {
    const title = titleDraft.trim();
    if (!title) return;

    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).catch(() => null);

    if (!res || !res.ok) {
      alert('Failed to update gallery title');
      return;
    }

    setItems(prev => prev.map(item => (item.id === id ? { ...item, title } : item)));
    setEditingId(null);
    setTitleDraft('');
  };

  const handleEditInEditor = async (id: string) => {
    setEditingGalleryId(id);
    try {
      const res = await fetch(`/api/gallery/${id}`, { cache: 'no-store' });
      if (!res.ok) {
        alert('Failed to load gallery data for editing.');
        return;
      }

      const data = await res.json();
      const detail = data?.item as {
        id: string;
        layout?: number;
        imageUrl?: string;
        previewDataUrl?: string | null;
        stripDataUrl?: string | null;
        liveVideoDataUrl?: string | null;
        photoFrames?: string[];
        livePhotos?: string[];
      };

      const sourcePhotos = [
        ...(Array.isArray(detail?.photoFrames) ? detail.photoFrames : []),
      ];

      if (sourcePhotos.length === 0 && Array.isArray(detail?.livePhotos)) {
        sourcePhotos.push(...detail.livePhotos);
      }

      if (sourcePhotos.length === 0) {
        if (typeof detail?.stripDataUrl === 'string' && detail.stripDataUrl) sourcePhotos.push(detail.stripDataUrl);
        else if (typeof detail?.previewDataUrl === 'string' && detail.previewDataUrl) sourcePhotos.push(detail.previewDataUrl);
        else if (typeof detail?.imageUrl === 'string' && detail.imageUrl) sourcePhotos.push(detail.imageUrl);
      }

      const normalizedPhotos = sourcePhotos
        .map(normalizeEditorImageSource)
        .filter((v): v is string => Boolean(v));
      if (normalizedPhotos.length === 0) {
        alert('Photos for this item are not available in the editor.');
        return;
      }

      saveTempPhotosToSessionStorage(normalizedPhotos);
      if (isIndexedDBSupported()) {
        await savePhotosToIndexedDB(normalizedPhotos);
      }

      if (typeof detail?.liveVideoDataUrl === 'string' && detail.liveVideoDataUrl.length > 0) {
        saveTempLiveVideoUrlToSessionStorage(detail.liveVideoDataUrl);
      } else {
        clearTempLiveVideoUrlFromSessionStorage();
      }

      const nextLayout = Number.isFinite(Number(detail?.layout))
        ? Number(detail.layout)
        : Math.max(1, normalizedPhotos.length);

      router.push(`/photo/edit?layout=${nextLayout}&source=gallery&id=${detail.id}`);
    } catch {
      alert('An error occurred while preparing the editor.');
    } finally {
      setEditingGalleryId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#d72688]">Photo Gallery</h1>
          <p className="text-sm text-gray-600 mt-1">Strip previews are optimized so more sessions can be displayed at once.</p>
          <Link href="/photo/edit" prefetch={false} className="inline-block mt-2 text-sm font-semibold text-[#d72688] hover:underline">
            + Add from Editor
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={selectAll}
              disabled={items.length === 0}
              className="px-3 py-1.5 rounded-lg border border-pink-200 text-[#d72688] bg-[#fff7fb] hover:bg-[#ffe4ef] text-sm transition disabled:opacity-50"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded-lg border border-pink-200 text-[#d72688] bg-white hover:bg-pink-50 text-sm transition disabled:opacity-50"
            >
              Clear Selection
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedIds.length})
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-10 text-center text-gray-500 font-medium">
            Loading gallery data...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-10 text-center">
            <ImageIcon className="w-10 h-10 text-pink-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No photos in gallery yet.</p>
            <p className="text-sm text-gray-500 mt-1">Create one from the editor page and save to gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => {
              const itemLink = `/photo/gallery/${item.id}`;
              const isEditing = editingId === item.id;
              const isSelected = selectedIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden transition ${
                    isSelected ? 'border-[#d72688] ring-2 ring-pink-200' : 'border-pink-100'
                  }`}
                >
                  <div className="flex items-center justify-between px-2 pt-2">
                    <label className="inline-flex items-center gap-1 text-[11px] text-gray-600">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-pink-300 text-[#d72688] focus:ring-pink-300"
                      />
                      Select
                    </label>
                  </div>

                  <div className="w-full bg-pink-50 px-2 pb-2 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageSrc}
                      alt={`gallery-item-${item.id}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-[180px] object-contain rounded-lg border border-pink-100 bg-white"
                    />
                  </div>

                  <div className="p-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          value={titleDraft}
                          onChange={e => setTitleDraft(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                          placeholder="Photo title"
                        />
                        <button
                          onClick={() => saveEditTitle(item.id)}
                          className="inline-flex items-center justify-center p-2 rounded-lg bg-[#fa75aa] text-white hover:bg-[#d72688] transition"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditTitle}
                          className="inline-flex items-center justify-center p-2 rounded-lg border border-pink-200 text-[#d72688] hover:bg-pink-50 transition"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-sm font-bold text-[#d72688] truncate" title={item.title}>{item.title}</h3>
                    )}

                    <p className="text-[11px] text-gray-500">{new Date(item.createdAt).toLocaleString('id-ID')}</p>
                    <p className="text-xs font-semibold text-[#d72688] mt-1">Layout {item.layout} • {item.filter}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link
                        href={itemLink}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#fa75aa] hover:bg-[#d72688] text-white text-xs transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Detail
                      </Link>
                      <button
                        onClick={() => startEditTitle(item)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#f8bfd7] text-[#d72688] bg-[#fff7fb] hover:bg-[#ffe4ef] text-xs transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleEditInEditor(item.id)}
                        disabled={editingGalleryId === item.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#f8bfd7] text-[#d72688] bg-white hover:bg-[#fff0f7] text-xs transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        {editingGalleryId === item.id ? 'Preparing...' : 'Edit in Editor'}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete.open}
        title={confirmDelete.title}
        message={confirmDelete.message}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        loading={confirmLoading}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDeleteItems}
      />
    </main>
  );
}
