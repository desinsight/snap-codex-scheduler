import { MongoClient, Db, Collection } from 'mongodb';
import { NotificationHistory, NotificationPreference } from '../types/notification';
import { Schedule } from '../types/schedule';
import path from 'path';
import fs from 'fs';

interface DatabaseConfig {
  url: string;
  dbName: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient;
  private db: Db;
  private config: DatabaseConfig;

  private constructor() {
    this.config = {
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
      dbName: process.env.MONGODB_DB_NAME || 'scheduler',
    };
    this.client = new MongoClient(this.config.url);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(this.config.dbName);
      await this.initializeCollections();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  private async initializeCollections(): Promise<void> {
    const collections = await this.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    if (!collectionNames.includes('notifications')) {
      await this.db.createCollection('notifications');
      await this.db.collection('notifications').createIndex({ userId: 1 });
      await this.db.collection('notifications').createIndex({ timestamp: -1 });
      await this.db.collection('notifications').createIndex({ read: 1 });
    }

    if (!collectionNames.includes('preferences')) {
      await this.db.createCollection('preferences');
      await this.db.collection('preferences').createIndex({ userId: 1 }, { unique: true });
    }

    if (!collectionNames.includes('schedules')) {
      await this.db.createCollection('schedules');
      await this.db.collection('schedules').createIndex({ userId: 1 });
      await this.db.collection('schedules').createIndex({ startDate: 1 });
      await this.db.collection('schedules').createIndex({ endDate: 1 });
    }
  }

  public async saveNotification(notification: NotificationHistory): Promise<void> {
    await this.db.collection('notifications').insertOne(notification);
  }

  public async getNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationHistory[]> {
    return this.db
      .collection('notifications')
      .find({ userId })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  public async updateNotification(
    notificationId: string,
    updates: Partial<NotificationHistory>
  ): Promise<void> {
    await this.db
      .collection('notifications')
      .updateOne({ id: notificationId }, { $set: updates });
  }

  public async savePreferences(
    userId: string,
    preferences: NotificationPreference
  ): Promise<void> {
    await this.db
      .collection('preferences')
      .updateOne(
        { userId },
        { $set: preferences },
        { upsert: true }
      );
  }

  public async getPreferences(
    userId: string
  ): Promise<NotificationPreference | null> {
    return this.db
      .collection('preferences')
      .findOne({ userId });
  }

  public async saveSchedule(schedule: Schedule): Promise<void> {
    await this.db
      .collection('schedules')
      .updateOne(
        { id: schedule.id },
        { $set: schedule },
        { upsert: true }
      );
  }

  public async getSchedule(scheduleId: string): Promise<Schedule | null> {
    return this.db
      .collection('schedules')
      .findOne({ id: scheduleId });
  }

  public async backup(): Promise<void> {
    const collections = ['notifications', 'preferences', 'schedules'];
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`);

    const backupData: Record<string, any[]> = {};
    for (const collection of collections) {
      backupData[collection] = await this.db
        .collection(collection)
        .find()
        .toArray();
    }

    await fs.promises.writeFile(
      backupPath,
      JSON.stringify(backupData, null, 2)
    );
  }

  public async restore(backupFile: string): Promise<void> {
    const backupData = JSON.parse(
      await fs.promises.readFile(backupFile, 'utf-8')
    );

    for (const [collection, documents] of Object.entries(backupData)) {
      if (documents.length > 0) {
        await this.db.collection(collection).deleteMany({});
        await this.db.collection(collection).insertMany(documents);
      }
    }
  }

  public async close(): Promise<void> {
    await this.client.close();
  }
}
