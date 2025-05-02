import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
export class WidgetInteractionService {
    static instance;
    eventBus = new Subject();
    drilldownConfigs = new Map();
    filterConfigs = new Map();
    sharedData = new Map();
    constructor() { }
    static getInstance() {
        if (!WidgetInteractionService.instance) {
            WidgetInteractionService.instance = new WidgetInteractionService();
        }
        return WidgetInteractionService.instance;
    }
    // 이벤트 발행
    publishEvent(event) {
        this.eventBus.next(event);
    }
    // 특정 위젯에 대한 이벤트 구독
    subscribeToWidget(widgetId) {
        return this.eventBus.pipe(filter(event => !event.targetWidgetIds ||
            event.targetWidgetIds.includes(widgetId)));
    }
    // 드릴다운 설정 등록
    registerDrilldown(sourceWidgetId, config) {
        const configs = this.drilldownConfigs.get(sourceWidgetId) || [];
        configs.push(config);
        this.drilldownConfigs.set(sourceWidgetId, configs);
    }
    // 드릴다운 실행
    executeDrilldown(sourceWidgetId, data) {
        const configs = this.drilldownConfigs.get(sourceWidgetId);
        if (!configs)
            return;
        configs.forEach(config => {
            const mappedData = Object.entries(config.mapping).reduce((acc, [source, target]) => {
                acc[target] = data[source];
                return acc;
            }, {});
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
    registerFilter(widgetId, config) {
        const configs = this.filterConfigs.get(widgetId) || [];
        configs.push(config);
        this.filterConfigs.set(widgetId, configs);
    }
    // 필터 적용
    applyFilter(widgetId, data) {
        const configs = this.filterConfigs.get(widgetId);
        if (!configs)
            return data;
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
    shareData(key, data) {
        this.sharedData.set(key, data);
        this.publishEvent({
            sourceWidgetId: 'dataShare',
            type: 'custom',
            data: { key, data }
        });
    }
    // 공유된 데이터 가져오기
    getSharedData(key) {
        return this.sharedData.get(key);
    }
    // 공유된 데이터 구독
    subscribeToSharedData(key) {
        return this.eventBus.pipe(filter(event => event.type === 'custom' &&
            event.data.key === key), map(event => event.data.data));
    }
    replacePlaceholders(query, data) {
        return Object.entries(data).reduce((q, [key, value]) => q.replace(`\${${key}}`, String(value)), query);
    }
    // 모든 설정 초기화
    reset() {
        this.drilldownConfigs.clear();
        this.filterConfigs.clear();
        this.sharedData.clear();
    }
}
