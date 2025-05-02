import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface InteractionEvent {
  sourceWidgetId: string;
  type: 'filter' | 'drilldown' | 'selection' | 'custom';
  data: any;
  targetWidgetIds?: string[];
}

export interface DrilldownConfig {
  sourceField: string;
  targetWidget: string;
  mapping: Record<string, string>;
  query: string;
}

export interface FilterConfig {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
  value: any;
}

export class WidgetInteractionService {
  private static instance: WidgetInteractionService;
  private eventBus: Subject<InteractionEvent> = new Subject();
  private drilldownConfigs: Map<string, DrilldownConfig[]> = new Map();
  private filterConfigs: Map<string, FilterConfig[]> = new Map();
  private sharedData: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): WidgetInteractionService {
    if (!WidgetInteractionService.instance) {
      WidgetInteractionService.instance = new WidgetInteractionService();
    }
    return WidgetInteractionService.instance;
  }

  // 이벤트 발행
  publishEvent(event: InteractionEvent) {
    this.eventBus.next(event);
  }

  // 특정 위젯에 대한 이벤트 구독
  subscribeToWidget(widgetId: string): Observable<InteractionEvent> {
    return this.eventBus.pipe(
      filter(event => 
        !event.targetWidgetIds || 
        event.targetWidgetIds.includes(widgetId)
      )
    );
  }

  // 드릴다운 설정 등록
  registerDrilldown(sourceWidgetId: string, config: DrilldownConfig) {
    const configs = this.drilldownConfigs.get(sourceWidgetId) || [];
    configs.push(config);
    this.drilldownConfigs.set(sourceWidgetId, configs);
  }

  // 드릴다운 실행
  executeDrilldown(sourceWidgetId: string, data: any) {
    const configs = this.drilldownConfigs.get(sourceWidgetId);
    if (!configs) return;

    configs.forEach(config => {
      const mappedData = Object.entries(config.mapping).reduce(
        (acc, [source, target]) => {
          acc[target] = data[source];
          return acc;
        },
        {} as Record<string, any>
      );

      this.publishEvent({
        sourceWidgetId,
        type: 'drilldown',
        data: {
          query: this.replacePlaceholders(config.query, mappedData),
          mappedData
        },
        targetWidgetIds: [config.targetWidget]
      });
    });
  }

  // 필터 설정 등록
  registerFilter(widgetId: string, config: FilterConfig) {
    const configs = this.filterConfigs.get(widgetId) || [];
    configs.push(config);
    this.filterConfigs.set(widgetId, configs);
  }

  // 필터 적용
  applyFilter(widgetId: string, data: any[]): any[] {
    const configs = this.filterConfigs.get(widgetId);
    if (!configs) return data;

    return data.filter(item => {
      return configs.every(config => {
        const value = item[config.field];
        switch (config.operator) {
          case 'equals':
            return value === config.value;
          case 'contains':
            return value.includes(config.value);
          case 'gt':
            return value > config.value;
          case 'lt':
            return value < config.value;
          case 'between':
            return value >= config.value[0] && value <= config.value[1];
          default:
            return true;
        }
      });
    });
  }

  // 데이터 공유
  shareData(key: string, data: any) {
    this.sharedData.set(key, data);
    this.publishEvent({
      sourceWidgetId: 'dataShare',
      type: 'custom',
      data: { key, data }
    });
  }

  // 공유된 데이터 가져오기
  getSharedData(key: string): any {
    return this.sharedData.get(key);
  }

  // 공유된 데이터 구독
  subscribeToSharedData(key: string): Observable<any> {
    return this.eventBus.pipe(
      filter(event => 
        event.type === 'custom' && 
        event.data.key === key
      ),
      map(event => event.data.data)
    );
  }

  private replacePlaceholders(query: string, data: Record<string, any>): string {
    return Object.entries(data).reduce(
      (q, [key, value]) => q.replace(`\${${key}}`, String(value)),
      query
    );
  }

  // 모든 설정 초기화
  reset() {
    this.drilldownConfigs.clear();
    this.filterConfigs.clear();
    this.sharedData.clear();
  }
} 