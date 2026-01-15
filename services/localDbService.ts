
/**
 * Crispy Bacon Local DB v1.2.2 - Persistence Layer
 * Optimized for Data Immortality and binary recovery.
 */

const DB_NAME = 'crispy_bacon_local';
const DB_VERSION = 2; 
const STORE_NAME = 'artifacts';

export enum SyncStatus {
  UNSYNCED = 'unsynced',
  IN_PROGRESS = 'in_progress',
  SYNCED = 'synced',
  FAILED = 'failed',
  RECOVERY = 'recovery' // Data that must never be auto-deleted
}

export interface LocalArtifact {
  id: string;
  blob?: Blob; 
  type: string;
  timestamp: number;
  metadata: any;
  sync_status: SyncStatus;
  sync_attempts: number;
  version: number;
}

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('sync_status', 'sync_status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

export const saveArtifactLocally = async (artifact: Partial<LocalArtifact>): Promise<void> => {
  const db = await openDb();
  const fullArtifact: LocalArtifact = {
    id: artifact.id!,
    blob: artifact.blob,
    type: artifact.type!,
    timestamp: artifact.timestamp || Date.now(),
    metadata: artifact.metadata || {},
    sync_status: artifact.sync_status || SyncStatus.UNSYNCED,
    sync_attempts: artifact.sync_attempts || 0,
    version: artifact.version || 1
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(fullArtifact);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const getArtifactLocally = async (id: string): Promise<LocalArtifact | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

/**
 * Maintenance: Only prune items that are strictly SYNCED and outside the 48h window.
 * Items marked as RECOVERY or UNSYNCED are immortal until manual user action.
 */
export const pruneLocalStorage = async (): Promise<number> => {
  const db = await openDb();
  const transaction = db.transaction(STORE_NAME, 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const index = store.index('timestamp');
  
  const cutOff = Date.now() - (48 * 60 * 60 * 1000); 
  let count = 0;

  return new Promise((resolve) => {
    index.openCursor(IDBKeyRange.upperBound(cutOff)).onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        const artifact = cursor.value;
        // CRITICAL DATA PROTECTION: Only delete if confirmed in cloud.
        if (artifact.sync_status === SyncStatus.SYNCED) {
          store.delete(cursor.primaryKey);
          count++;
        }
        cursor.continue();
      } else {
        resolve(count);
      }
    };
  });
};

export const getAllLocalArtifacts = async (includeBlobs: boolean = false, status?: SyncStatus): Promise<LocalArtifact[]> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    let request;
    if (status) {
      const index = store.index('sync_status');
      request = index.openCursor(IDBKeyRange.only(status));
    } else {
      request = store.openCursor();
    }
    
    const results: LocalArtifact[] = [];

    request.onsuccess = (event: any) => {
      const cursor = event.target.result;
      if (cursor) {
        const item = cursor.value;
        if (!includeBlobs) {
          const { blob, ...rest } = item;
          results.push(rest as LocalArtifact);
        } else {
          results.push(item);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
};

export const deleteArtifactLocally = async (id: string): Promise<void> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};
