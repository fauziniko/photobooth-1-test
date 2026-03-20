const TEMP_PHOTOS_KEY = 'photobooth-photos-temp';
const TEMP_LIVE_VIDEO_URL_KEY = 'photobooth-live-video-url-temp';

// Keep fallback payload small to avoid browser sessionStorage quota issues.
const MAX_SESSION_PHOTO_PAYLOAD_BYTES = 1_800_000;

export const loadTempPhotosFromSessionStorage = (): string[] => {
  try {
    const raw = sessionStorage.getItem(TEMP_PHOTOS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveTempPhotosToSessionStorage = (photos: string[]): boolean => {
  try {
    const serialized = JSON.stringify(photos);

    if (serialized.length > MAX_SESSION_PHOTO_PAYLOAD_BYTES) {
      sessionStorage.removeItem(TEMP_PHOTOS_KEY);
      return false;
    }

    sessionStorage.setItem(TEMP_PHOTOS_KEY, serialized);
    return true;
  } catch {
    // QuotaExceededError or unavailable session storage should not break flow.
    try {
      sessionStorage.removeItem(TEMP_PHOTOS_KEY);
    } catch {
      // Ignore remove errors.
    }
    return false;
  }
};

export const clearTempPhotosFromSessionStorage = () => {
  try {
    sessionStorage.removeItem(TEMP_PHOTOS_KEY);
  } catch {
    // Ignore remove errors.
  }
};

export const loadTempLiveVideoUrlFromSessionStorage = (): string | null => {
  try {
    const raw = sessionStorage.getItem(TEMP_LIVE_VIDEO_URL_KEY);
    if (!raw || typeof raw !== 'string') return null;
    return raw;
  } catch {
    return null;
  }
};

export const saveTempLiveVideoUrlToSessionStorage = (url: string): boolean => {
  try {
    if (!url || typeof url !== 'string') {
      sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
      return false;
    }

    sessionStorage.setItem(TEMP_LIVE_VIDEO_URL_KEY, url);
    return true;
  } catch {
    try {
      sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
    } catch {
      // Ignore remove errors.
    }
    return false;
  }
};

export const clearTempLiveVideoUrlFromSessionStorage = () => {
  try {
    sessionStorage.removeItem(TEMP_LIVE_VIDEO_URL_KEY);
  } catch {
    // Ignore remove errors.
  }
};
