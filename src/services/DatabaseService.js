import { MongoClient } from 'mongodb';
import path from 'path';
import fs from 'fs';
export class DatabaseService {
    static instance;
    client;
    db;
    config;
    constructor() {
        this.config = {
            url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
            dbName: process.env.MONGODB_DB_NAME || 'scheduler',
        };
        this.client = new MongoClient(this.config.url);
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db(this.config.dbName);
            await this.initializeCollections();
            console.log('Connected to MongoDB');
        }
        catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    async initializeCollections() {
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
    async saveNotification(notification) {
        await this.db.collection('notifications').insertOne(notification);
    }
    async getNotifications(userId, limit = 50, offset = 0) {
        return this.db
            .collection('notifications')
            .find({ userId })
            .sort({ timestamp: -1 })
            .skip(offset)
            .limit(limit)
            .toArray();
    }
    async updateNotification(notificationId, updates) {
        await this.db
            .collection('notifications')
            .updateOne({ id: notificationId }, { $set: updates });
    }
    async savePreferences(userId, preferences) {
        await this.db
            .collection('preferences')
            .updateOne({ userId }, { $set: preferences }, { upsert: true });
    }
    async getPreferences(userId) {
        return this.db
            .collection('preferences')
            .findOne({ userId });
    }
    async saveSchedule(schedule) {
        await this.db
            .collection('schedules')
            .updateOne({ id: schedule.id }, { $set: schedule }, { upsert: true });
    }
    async getSchedule(scheduleId) {
        return this.db
            .collection('schedules')
            .findOne({ id: scheduleId });
    }
    async backup() {
        const collections = ['notifications', 'preferences', 'schedules'];
        const backupDir = path.join(__dirname, '../../backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}.json`);
        const backupData = {};
        for (const collection of collections) {
            backupData[collection] = await this.db
                .collection(collection)
                .find()
                .toArray();
        }
        await fs.promises.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    }
    async restore(backupFile) {
        const backupData = JSON.parse(await fs.promises.readFile(backupFile, 'utf-8'));
        for (const [collection, documents] of Object.entries(backupData)) {
            if (documents.length > 0) {
                await this.db.collection(collection).deleteMany({});
                await this.db.collection(collection).insertMany(documents);
            }
        }
    }
    async close() {
        await this.client.close();
    }
}
