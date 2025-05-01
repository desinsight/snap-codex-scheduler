export interface ExternalServiceConfig {
  serviceType: 'slack' | 'teams' | 'webhook';
  name: string;
  webhookUrl: string;
  apiKey?: string;
  channel?: string;
  enabled: boolean;
  lastConnected?: Date;
  errorCount: number;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  retryPolicy: {
    maxAttempts: number;
    backoffInterval: number;
  };
}

export interface IntegrationState {
  services: ExternalServiceConfig[];
  webhooks: WebhookConfig[];
  loading: boolean;
  error: string | null;
}

export interface IntegrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface WebhookEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  lastAttempt?: Date;
  error?: string;
}
