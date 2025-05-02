import { HeatmapData } from '../types/heatmap';

export class HeatmapService {
  private static instance: HeatmapService;
  private data: HeatmapData[] = [];

  private constructor() {
    // 초기 히트맵 데이터 로드
    this.loadInitialData();
  }

  public static getInstance(): HeatmapService {
    if (!HeatmapService.instance) {
      HeatmapService.instance = new HeatmapService();
    }
    return HeatmapService.instance;
  }

  private async loadInitialData(): Promise<void> {
    try {
      // 실제 구현에서는 API에서 데이터를 가져와야 합니다
      const response = await fetch('/api/heatmap');
      this.data = await response.json();
    } catch (error) {
      console.error('Failed to load initial heatmap data:', error);
    }
  }

  public async getHeatmapData(
    timeRange: '24h' | '7d' | '30d',
    metric: 'requests' | 'errors' | 'latency'
  ): Promise<HeatmapData[]> {
    try {
      // 시간 범위에 따른 필터링
      const now = new Date();
      const filteredData = this.data.filter(item => {
        const itemDate = new Date(item.timestamp);
        const timeDiff = now.getTime() - itemDate.getTime();
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

      // 요일과 시간별로 데이터 집계
      const aggregatedData: { [key: string]: HeatmapData } = {};

      filteredData.forEach(item => {
        const date = new Date(item.timestamp);
        const day = date.getDay(); // 0: 일요일, 6: 토요일
        const hour = date.getHours();
        const key = `${day}-${hour}`;

        if (!aggregatedData[key]) {
          aggregatedData[key] = {
            day,
            hour,
            value: 0,
            timestamp: item.timestamp
          };
        }

        // 메트릭에 따른 값 집계
        switch (metric) {
          case 'requests':
            aggregatedData[key].value += 1;
            break;
          case 'errors':
            if (item.isError) {
              aggregatedData[key].value += 1;
            }
            break;
          case 'latency':
            aggregatedData[key].value = Math.max(aggregatedData[key].value, item.latency || 0);
            break;
        }
      });

      return Object.values(aggregatedData);
    } catch (error) {
      console.error('Failed to get heatmap data:', error);
      throw error;
    }
  }

  public async addDataPoint(data: Omit<HeatmapData, 'timestamp'>): Promise<HeatmapData> {
    try {
      const newData: HeatmapData = {
        ...data,
        timestamp: new Date().toISOString()
      };

      this.data.push(newData);
      return newData;
    } catch (error) {
      console.error('Failed to add data point:', error);
      throw error;
    }
  }

  public async clearData(): Promise<void> {
    try {
      this.data = [];
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
} 