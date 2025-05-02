export class WidgetValidationService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!WidgetValidationService.instance) {
            WidgetValidationService.instance = new WidgetValidationService();
        }
        return WidgetValidationService.instance;
    }
    validateWidget(config) {
        const errors = [];
        // 기본 필수 필드 검증
        if (!config.title) {
            errors.push('위젯 제목은 필수입니다.');
        }
        if (!config.type) {
            errors.push('위젯 유형은 필수입니다.');
        }
        if (config.type) {
            // 위젯 유형별 검증
            switch (config.type) {
                case 'chart':
                    this.validateChartWidget(config, errors);
                    break;
                case 'metric':
                    this.validateMetricWidget(config, errors);
                    break;
                case 'table':
                    this.validateTableWidget(config, errors);
                    break;
                case 'status':
                    this.validateStatusWidget(config, errors);
                    break;
            }
        }
        // 레이아웃 관련 검증
        if (config.x !== undefined && config.x < 0) {
            errors.push('x 좌표는 0 이상이어야 합니다.');
        }
        if (config.y !== undefined && config.y < 0) {
            errors.push('y 좌표는 0 이상이어야 합니다.');
        }
        if (config.width !== undefined && (config.width < 1 || config.width > 12)) {
            errors.push('너비는 1에서 12 사이여야 합니다.');
        }
        if (config.height !== undefined && config.height < 1) {
            errors.push('높이는 1 이상이어야 합니다.');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateChartWidget(config, errors) {
        if (!config.settings?.chartType) {
            errors.push('차트 유형은 필수입니다.');
        }
        else if (!Object.values(ChartType).includes(config.settings.chartType)) {
            errors.push('유효하지 않은 차트 유형입니다.');
        }
        if (!config.settings?.query) {
            errors.push('데이터 쿼리는 필수입니다.');
        }
        if (config.settings?.refreshInterval !== undefined && config.settings.refreshInterval < 0) {
            errors.push('새로고침 주기는 0 이상이어야 합니다.');
        }
    }
    validateMetricWidget(config, errors) {
        if (!config.settings?.metric) {
            errors.push('메트릭은 필수입니다.');
        }
        if (config.settings?.refreshInterval !== undefined && config.settings.refreshInterval < 0) {
            errors.push('새로고침 주기는 0 이상이어야 합니다.');
        }
    }
    validateTableWidget(config, errors) {
        if (!config.settings?.query) {
            errors.push('데이터 쿼리는 필수입니다.');
        }
        if (config.settings?.refreshInterval !== undefined && config.settings.refreshInterval < 0) {
            errors.push('새로고침 주기는 0 이상이어야 합니다.');
        }
    }
    validateStatusWidget(config, errors) {
        if (!config.settings?.query) {
            errors.push('상태 쿼리는 필수입니다.');
        }
        if (config.settings?.refreshInterval !== undefined && config.settings.refreshInterval < 0) {
            errors.push('새로고침 주기는 0 이상이어야 합니다.');
        }
    }
    validateTheme(theme) {
        const errors = [];
        if (!theme?.colors) {
            errors.push('색상 설정은 필수입니다.');
        }
        else {
            const requiredColors = ['primary', 'secondary', 'background', 'surface', 'text', 'border'];
            for (const color of requiredColors) {
                if (!theme.colors[color]) {
                    errors.push(`${color} 색상은 필수입니다.`);
                }
            }
        }
        if (!theme?.typography) {
            errors.push('타이포그래피 설정은 필수입니다.');
        }
        else {
            if (!theme.typography.fontFamily) {
                errors.push('글꼴은 필수입니다.');
            }
            if (!theme.typography.fontSize) {
                errors.push('글꼴 크기 설정은 필수입니다.');
            }
            else {
                const requiredSizes = ['small', 'medium', 'large'];
                for (const size of requiredSizes) {
                    if (!theme.typography.fontSize[size]) {
                        errors.push(`${size} 글꼴 크기는 필수입니다.`);
                    }
                }
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateMetricUnit(unit) {
        const errors = [];
        if (!unit?.id) {
            errors.push('단위 ID는 필수입니다.');
        }
        if (!unit?.name) {
            errors.push('단위 이름은 필수입니다.');
        }
        if (!unit?.symbol) {
            errors.push('단위 기호는 필수입니다.');
        }
        if (typeof unit?.conversion !== 'function') {
            errors.push('변환 함수는 필수입니다.');
        }
        if (typeof unit?.format !== 'function') {
            errors.push('포맷 함수는 필수입니다.');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
