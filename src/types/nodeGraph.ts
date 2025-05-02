export interface NodeGraphData {
  nodes: {
    id: string;
    type: 'service' | 'database' | 'cache' | 'other';
    name: string;
    status: 'active' | 'inactive' | 'error';
    metrics?: {
      cpu?: number;
      memory?: number;
      latency?: number;
    };
    timestamp: string;
  }[];
  links: {
    id: string;
    source: { id: string };
    target: { id: string };
    type: 'http' | 'database' | 'cache' | 'other';
    value: number;
    timestamp: string;
  }[];
} 