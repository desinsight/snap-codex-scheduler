import { NotificationHistory } from '../types/notification';

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private listeners: Map<string, Set<Function>> = new Map();

  private constructor(config: WebSocketConfig) {
    this.config = config;
    this.connect();
  }

  public static getInstance(config: WebSocketConfig): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(config);
    }
    return WebSocketService.instance;
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket 연결됨');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data.type, data.payload);
      } catch (error) {
        console.error('메시지 파싱 실패:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket 연결 종료');
      this.handleReconnect();
    };

    this.ws.onerror = error => {
      console.error('WebSocket 에러:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.config.reconnectInterval);
    } else {
      console.error('최대 재연결 시도 횟수 초과');
    }
  }

  public subscribe(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);
  }

  public unsubscribe(eventType: string, callback: Function) {
    this.listeners.get(eventType)?.delete(callback);
  }

  private notifyListeners(eventType: string, payload: any) {
    this.listeners.get(eventType)?.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error(`이벤트 핸들러 에러 (${eventType}):`, error);
      }
    });
  }

  public sendNotification(notification: NotificationHistory) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'notification',
          payload: notification,
        })
      );
    } else {
      console.warn('WebSocket이 연결되지 않았습니다.');
    }
  }

  public close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default WebSocketService;
