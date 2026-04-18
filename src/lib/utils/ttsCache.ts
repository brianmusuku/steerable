/**
 * A simple client-side cache for TTS results using IndexedDB.
 * This persists audio and metadata in the browser so we don't 
 * have to re-generate them on page reload.
 */

const DB_NAME = 'TTSCacheDB';
const STORE_NAME = 'tts_cache';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

async function getDB(): Promise<IDBDatabase> {
	if (db) return db;

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			db = request.result;
			resolve(db);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'hash' });
			}
		};
	});
}

export interface CachedTTS {
	hash: string;
	audio: string; // base64
	timestamps: any;
	duration: number;
	text: string;
	voice: string;
}

export async function getCachedTTS(hash: string): Promise<CachedTTS | null> {
    if (typeof window === 'undefined') return null;
	try {
		const database = await getDB();
		return new Promise((resolve, reject) => {
			const transaction = database.transaction(STORE_NAME, 'readonly');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(hash);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve(request.result || null);
		});
	} catch (err) {
		console.warn('[TTS Cache] Failed to get from IndexedDB', err);
		return null;
	}
}

export async function saveTTS(data: CachedTTS): Promise<void> {
    if (typeof window === 'undefined') return;
	try {
		const database = await getDB();
		return new Promise((resolve, reject) => {
			const transaction = database.transaction(STORE_NAME, 'readwrite');
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put(data);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	} catch (err) {
		console.warn('[TTS Cache] Failed to save to IndexedDB', err);
	}
}
