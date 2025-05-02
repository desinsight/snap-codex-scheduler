import { DashboardLayout } from '../types/dashboard';

export class DashboardBackupService {
  private static instance: DashboardBackupService;
  private static readonly STORAGE_KEY = 'dashboard_backups';

  private constructor() {}

  static getInstance(): DashboardBackupService {
    if (!DashboardBackupService.instance) {
      DashboardBackupService.instance = new DashboardBackupService();
    }
    return DashboardBackupService.instance;
  }

  async createBackup(layout: DashboardLayout): Promise<string> {
    const backup = {
      id: this.generateBackupId(),
      layout,
      timestamp: new Date().toISOString(),
      name: `Backup ${new Date().toLocaleString()}`
    };

    const backups = await this.getBackups();
    backups.push(backup);
    await this.saveBackups(backups);

    return backup.id;
  }

  async getBackups(): Promise<Backup[]> {
    try {
      const backupsJson = localStorage.getItem(DashboardBackupService.STORAGE_KEY);
      return backupsJson ? JSON.parse(backupsJson) : [];
    } catch (error) {
      console.error('Failed to load backups:', error);
      return [];
    }
  }

  async restoreBackup(backupId: string): Promise<DashboardLayout | null> {
    const backups = await this.getBackups();
    const backup = backups.find(b => b.id === backupId);

    if (!backup) {
      return null;
    }

    return backup.layout;
  }

  async deleteBackup(backupId: string): Promise<void> {
    const backups = await this.getBackups();
    const filteredBackups = backups.filter(b => b.id !== backupId);
    await this.saveBackups(filteredBackups);
  }

  async exportBackup(backupId: string): Promise<string> {
    const backups = await this.getBackups();
    const backup = backups.find(b => b.id === backupId);

    if (!backup) {
      throw new Error('Backup not found');
    }

    return JSON.stringify(backup, null, 2);
  }

  async importBackup(backupJson: string): Promise<string> {
    try {
      const backup = JSON.parse(backupJson);
      
      // 백업 데이터 유효성 검사
      if (!this.isValidBackup(backup)) {
        throw new Error('Invalid backup format');
      }

      const backups = await this.getBackups();
      backup.id = this.generateBackupId(); // 새로운 ID 할당
      backups.push(backup);
      await this.saveBackups(backups);

      return backup.id;
    } catch (error) {
      throw new Error('Failed to import backup: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  private generateBackupId(): string {
    return 'backup_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async saveBackups(backups: Backup[]): Promise<void> {
    try {
      localStorage.setItem(DashboardBackupService.STORAGE_KEY, JSON.stringify(backups));
    } catch (error) {
      console.error('Failed to save backups:', error);
      throw new Error('Failed to save backups');
    }
  }

  private isValidBackup(backup: any): boolean {
    return (
      backup &&
      typeof backup === 'object' &&
      typeof backup.id === 'string' &&
      typeof backup.timestamp === 'string' &&
      typeof backup.name === 'string' &&
      backup.layout &&
      typeof backup.layout === 'object' &&
      typeof backup.layout.id === 'string' &&
      typeof backup.layout.userId === 'string' &&
      typeof backup.layout.name === 'string' &&
      Array.isArray(backup.layout.widgets)
    );
  }
}

interface Backup {
  id: string;
  layout: DashboardLayout;
  timestamp: string;
  name: string;
} 