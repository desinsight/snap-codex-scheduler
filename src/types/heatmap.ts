export interface HeatmapData {
  day: number; // 0: 일요일, 6: 토요일
  hour: number; // 0-23
  value: number;
  timestamp: string;
  isError?: boolean;
  latency?: number;
} 