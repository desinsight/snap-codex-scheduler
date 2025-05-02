export class OfflineStorage {
    static instance;
    db = null;
    config;
    constructor(config) {
        this.config = config;
    }
    static getInstance(config) {
        if (!OfflineStorage.instance) {
            OfflineStorage.instance = new OfflineStorage(config);
        }
        return OfflineStorage.instance;
    }
    // DB 초기화
    async initialize() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.version);
            request.onerror = () => {
                reject(new Error('IndexedDB 초기화 실패'));
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // 스토어 생성
                Object.entries(this.config.stores).forEach(([storeName, storeConfig]) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, {
                            keyPath: storeConfig.keyPath
                        });
                        // 인덱스 생성
                        storeConfig.indexes?.forEach(index => {
                            store.createIndex(index.name, index.keyPath, index.options);
                        });
                    }
                });
            };
        });
    }
    // 데이터 저장
    async save(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('DB가 초기화되지 않았습니다'));
                return;
            }
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            request.onerror = () => {
                reject(new Error('데이터 저장 실패'));
            };
            request.onsuccess = () => {
                resolve();
            };
        });
    }
    // 데이터 조회
    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('DB가 초기화되지 않았습니다'));
                return;
            }
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onerror = () => {
                reject(new Error('데이터 조회 실패'));
            };
            request.onsuccess = () => {
                resolve(request.result || null);
            };
        });
    }
    // 데이터 삭제
    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('DB가 초기화되지 않았습니다'));
                return;
            }
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            request.onerror = () => {
                reject(new Error('데이터 삭제 실패'));
            };
            request.onsuccess = () => {
                resolve();
            };
        });
    }
    // 인덱스 기반 조회
    async getByIndex(storeName, indexName, key) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('DB가 초기화되지 않았습니다'));
                return;
            }
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(key);
            request.onerror = () => {
                reject(new Error('인덱스 조회 실패'));
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }
    // 전체 데이터 조회
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('DB가 초기화되지 않았습니다'));
                return;
            }
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onerror = () => {
                reject(new Error('전체 데이터 조회 실패'));
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }
    // 데이터 동기화 상태 관리
    async markForSync(storeName, key) {
        const syncStore = 'syncQueue';
        await this.save(syncStore, {
            id: `${storeName}-${key}`,
            storeName,
            key,
            timestamp: Date.now()
        });
    }
    // 동기화 큐 조회
    async getSyncQueue() {
        return this.getAll('syncQueue');
    }
    // 동기화 완료 처리
    async clearSyncMark(id) {
        await this.delete('syncQueue', id);
    }
}
