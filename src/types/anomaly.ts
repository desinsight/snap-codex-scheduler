export interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning';
  source: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
  metadata?: {
    [key: string]: any;
  };
} 