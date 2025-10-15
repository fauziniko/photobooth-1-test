/**
 * IndexedDB utility for storing photos locally in browser
 * Photos persist across page refreshes
 */

const DB_NAME = 'PhotoboothDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        console.log('✅ IndexedDB object store created');
      }
    };
  });
};

// Save photos to IndexedDB
export const savePhotosToIndexedDB = async (photos: string[]): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing photos first
    store.clear();

    // Add new photos
    photos.forEach((photoData, index) => {
      store.add({
        photoData,
        timestamp: Date.now(),
        index,
      });
    });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('✅ Photos saved to IndexedDB:', photos.length);
        resolve();
      };
      transaction.onerror = () => {
        console.error('❌ Failed to save photos to IndexedDB');
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('❌ IndexedDB save error:', error);
    throw error;
  }
};

// Load photos from IndexedDB
export const loadPhotosFromIndexedDB = async (): Promise<string[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const records = request.result || [];
        // Sort by index to maintain order
        records.sort((a, b) => a.index - b.index);
        const photos = records.map(record => record.photoData);
        console.log('✅ Photos loaded from IndexedDB:', photos.length);
        resolve(photos);
      };

      request.onerror = () => {
        console.error('❌ Failed to load photos from IndexedDB');
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('❌ IndexedDB load error:', error);
    return []; // Return empty array on error
  }
};

// Clear all photos from IndexedDB
export const clearPhotosFromIndexedDB = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log('✅ Photos cleared from IndexedDB');
        resolve();
      };
      transaction.onerror = () => {
        console.error('❌ Failed to clear photos from IndexedDB');
        reject(transaction.error);
      };
    });
  } catch (error) {
    console.error('❌ IndexedDB clear error:', error);
    throw error;
  }
};

// Check if IndexedDB is supported
export const isIndexedDBSupported = (): boolean => {
  return typeof indexedDB !== 'undefined';
};
