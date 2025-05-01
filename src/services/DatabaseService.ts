import { NotificationHistory, NotificationPreference } from '../types/notification';

interface DatabaseConfig {
  type: 'indexeddb' | 'firebase' | 'mongodb';
  config: any;
}

class DatabaseService {
  private static instance: DatabaseService;
  private db: IDBDatabase | null = null;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = config;
    this.initialize();
  }

  public static getInstance(config: DatabaseConfig): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(config);
    }
    return DatabaseService.instance;
  }

  private async initialize() {
    if (this.config.type === 'indexeddb') {
      await this.initializeIndexedDB();
    } else if (this.config.type === 'firebase') {
      await this.initializeFirebase();
    } else if (this.config.type === 'mongodb') {
      await this.initializeMongoDB();
    }
  }

  private async initializeIndexedDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('NotificationDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('notifications')) {
          const store = db.createObjectStore('notifications', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('read', 'read', { unique: false });
        }

        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'userId' });
        }
      };
    });
  }

  private async initializeFirebase() {
    // Firebase 초기화 로직
    console.log('Firebase 초기화');
  }

  private async initializeMongoDB() {
    // MongoDB 초기화 로직
    console.log('MongoDB 초기화');
  }

  public async saveNotification(notification: NotificationHistory) {
    if (this.config.type === 'indexeddb' && this.db) {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction(['notifications'], 'readwrite');
        const store = transaction.objectStore('notifications');
        const request = store.add(notification);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
    // 다른 데이터베이스 타입에 대한 구현
  }

  public async getNotifications(
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationHistory[]> {
    if (this.config.type === 'indexeddb' && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['notifications'], 'readonly');
        const store = transaction.objectStore('notifications');
        const index = store.index('timestamp');
        const request = index.getAll(null, limit, offset);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return [];
  }

  public async updateNotification(
    id: string,
    updates: Partial<NotificationHistory>
  ) {
    if (this.config.type === 'indexeddb' && this.db) {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction(['notifications'], 'readwrite');
        const store = transaction.objectStore('notifications');
        const request = store.get(id);

        request.onsuccess = () => {
          const notification = request.result;
          if (notification) {
            const updated = { ...notification, ...updates };
            store.put(updated);
            resolve();
          } else {
            reject(new Error('알림을 찾을 수 없습니다.'));
          }
        };
        request.onerror = () => reject(request.error);
      });
    }
  }

  public async savePreferences(
    userId: string,
    preferences: NotificationPreference
  ) {
    if (this.config.type === 'indexeddb' && this.db) {
      return new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction(['preferences'], 'readwrite');
        const store = transaction.objectStore('preferences');
        const request = store.put({ userId, ...preferences });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  public async getPreferences(userId: string): Promise<NotificationPreference | null> {
    if (this.config.type === 'indexeddb' && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['preferences'], 'readonly');
        const store = transaction.objectStore('preferences');
        const request = store.get(userId);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return null;
  }

  public async backup() {
    if (this.config.type === 'indexeddb' && this.db) {
      const notifications = await this.getNotifications(Infinity);
      const preferences = await this.getPreferences('currentUser');
      
      const backup = {
        timestamp: new Date().toISOString(),
        notifications,
        preferences,
      };

      // 백업 데이터를 파일로 저장
      const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notification-backup-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  public async restore(backupFile: File) {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const backup = JSON.parse(event.target?.result as string);
          
          // 알림 복원
          for (const notification of backup.notifications) {
            await this.saveNotification(notification);
          }
          
          // 설정 복원
          if (backup.preferences) {
            await this.savePreferences('currentUser', backup.preferences);
          }
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsText(backupFile);
    });
  }
}

export default DatabaseService; 