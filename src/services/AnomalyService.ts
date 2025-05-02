import { Anomaly } from '../types/anomaly';

interface AnomalyStats {
  total: number;
  critical: number;
  warning: number;
}

interface AnomalyResponse {
  anomalies: Anomaly[];
  stats: AnomalyStats;
}

export class AnomalyService {
  private static instance: AnomalyService;
  private anomalies: Anomaly[] = [];

  private constructor() {
    // 초기 이상 징후 데이터 로드
    this.loadInitialData();
  }

  public static getInstance(): AnomalyService {
    if (!AnomalyService.instance) {
      AnomalyService.instance = new AnomalyService();
    }
    return AnomalyService.instance;
  }

  private async loadInitialData(): Promise<void> {
    try {
      // 실제 구현에서는 API에서 데이터를 가져와야 합니다
      const response = await fetch('/api/anomalies');
      this.anomalies = await response.json();
    } catch (error) {
      console.error('Failed to load initial anomaly data:', error);
    }
  }

  public async getAnomalies(
    timeRange: '24h' | '7d' | '30d',
    severity: 'all' | 'critical' | 'warning'
  ): Promise<AnomalyResponse> {
    try {
      // 시간 범위에 따른 필터링
      const now = new Date();
      const filteredAnomalies = this.anomalies.filter(anomaly => {
        const anomalyDate = new Date(anomaly.timestamp);
        const timeDiff = now.getTime() - anomalyDate.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        switch (timeRange) {
          case '24h':
            return hoursDiff <= 24;
          case '7d':
            return hoursDiff <= 24 * 7;
          case '30d':
            return hoursDiff <= 24 * 30;
          default:
            return true;
        }
      });

      // 심각도에 따른 필터링
      const severityFilteredAnomalies = severity === 'all'
        ? filteredAnomalies
        : filteredAnomalies.filter(anomaly => anomaly.severity === severity);

      // 통계 계산
      const stats: AnomalyStats = {
        total: severityFilteredAnomalies.length,
        critical: severityFilteredAnomalies.filter(a => a.severity === 'critical').length,
        warning: severityFilteredAnomalies.filter(a => a.severity === 'warning').length
      };

      return {
        anomalies: severityFilteredAnomalies,
        stats
      };
    } catch (error) {
      console.error('Failed to get anomalies:', error);
      throw error;
    }
  }

  public async addAnomaly(anomaly: Omit<Anomaly, 'id'>): Promise<Anomaly> {
    try {
      const newAnomaly: Anomaly = {
        ...anomaly,
        id: crypto.randomUUID()
      };

      this.anomalies.push(newAnomaly);
      return newAnomaly;
    } catch (error) {
      console.error('Failed to add anomaly:', error);
      throw error;
    }
  }

  public async updateAnomaly(id: string, updates: Partial<Anomaly>): Promise<Anomaly> {
    try {
      const index = this.anomalies.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Anomaly not found');
      }

      this.anomalies[index] = {
        ...this.anomalies[index],
        ...updates
      };

      return this.anomalies[index];
    } catch (error) {
      console.error('Failed to update anomaly:', error);
      throw error;
    }
  }

  public async deleteAnomaly(id: string): Promise<void> {
    try {
      this.anomalies = this.anomalies.filter(a => a.id !== id);
    } catch (error) {
      console.error('Failed to delete anomaly:', error);
      throw error;
    }
  }
} 