export type WidgetType = 'chart' | 'metric' | 'table' | 'status';

export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  settings: {
    chartType?: ChartType;
    metric?: string;
    unit?: string;
    timeRange?: string;
    refreshInterval?: number;
    query?: string;
  };
}

export interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  widgets: WidgetConfig[];
  theme?: ThemeConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface MetricUnit {
  id: string;
  name: string;
  symbol: string;
  conversion: (value: number) => number;
  format: (value: number) => string;
} 