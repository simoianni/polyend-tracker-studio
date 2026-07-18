import { toRaw } from 'vue';
import { AudioUtil, InstrumentData } from '@polyend/tracker-lib';

const DB_NAME = 'tracker-unified-editor';
const DB_VERSION = 1;
const STORE_INSTRUMENTS = 'instruments';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_INSTRUMENTS)) {
          db.createObjectStore(STORE_INSTRUMENTS);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        dbPromise = null;
        reject(request.error);
      };
    });
  }
  return dbPromise;
}

// IndexedDB cannot clone functions or Vue proxies: unwrap the reactive
// proxy and drop the enriched methods (re-added on load)
function serializeInstrument(data: InstrumentData): Record<string, unknown> {
  const raw = toRaw(data) as unknown as Record<string, unknown>;
  const plain: Record<string, unknown> = {};
  for (const key of Object.keys(raw)) {
    if (typeof raw[key] !== 'function') {
      plain[key] = raw[key];
    }
  }
  return plain;
}

export async function persistInstrument(slot: number, data: InstrumentData | null): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_INSTRUMENTS, 'readwrite');
      const store = tx.objectStore(STORE_INSTRUMENTS);
      if (data) {
        store.put(serializeInstrument(data), slot);
      } else {
        store.delete(slot);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Failed to persist instrument', slot, e);
  }
}

export async function clearPersistedInstruments(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_INSTRUMENTS, 'readwrite');
      tx.objectStore(STORE_INSTRUMENTS).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Failed to clear persisted instruments', e);
  }
}

export async function loadPersistedInstruments(): Promise<Map<number, InstrumentData>> {
  const instruments = new Map<number, InstrumentData>();
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_INSTRUMENTS, 'readonly');
      const request = tx.objectStore(STORE_INSTRUMENTS).openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const slot = cursor.key as number;
          try {
            instruments.set(slot, AudioUtil.enrichInstrument(cursor.value));
          } catch (e) {
            console.warn('Failed to restore instrument', slot, e);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('Failed to load persisted instruments', e);
  }
  return instruments;
}
