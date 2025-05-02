import axios from 'axios';
export class DashboardService {
    static instance;
    currentLayout = null;
    metricUnits = new Map();
    constructor() {
        this.initializeMetricUnits();
    }
    static getInstance() {
        if (!DashboardService.instance) {
            DashboardService.instance = new DashboardService();
        }
        return DashboardService.instance;
    }
    initializeMetricUnits() {
        const defaultUnits = [
            {
                id: 'bytes',
                name: '바이트',
                symbol: 'B',
                conversion: (value) => value,
                format: (value) => {
                    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
                    if (value === 0)
                        return '0 B';
                    const i = Math.floor(Math.log(value) / Math.log(1024));
                    return `${(value / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
                }
            },
            {
                id: 'percent',
                name: '퍼센트',
                symbol: '%',
                conversion: (value) => value * 100,
                format: (value) => `${value.toFixed(2)}%`
            },
            {
                id: 'milliseconds',
                name: '밀리초',
                symbol: 'ms',
                conversion: (value) => value,
                format: (value) => `${value.toFixed(2)}ms`
            }
        ];
        defaultUnits.forEach(unit => this.metricUnits.set(unit.id, unit));
    }
    // 대시보드 레이아웃 관리
    async getUserLayouts() {
        const response = await axios.get('/api/dashboards');
        return response.data;
    }
    async getLayout(id) {
        const response = await axios.get(`/api/dashboards/${id}`);
        this.currentLayout = response.data;
        return response.data;
    }
    async saveLayout(layout) {
        const response = layout.id
            ? await axios.put(`/api/dashboards/${layout.id}`, layout)
            : await axios.post('/api/dashboards', layout);
        this.currentLayout = response.data;
        return response.data;
    }
    async deleteLayout(id) {
        await axios.delete(`/api/dashboards/${id}`);
        if (this.currentLayout?.id === id) {
            this.currentLayout = null;
        }
    }
    // 위젯 관리
    async addWidget(widget) {
        if (!this.currentLayout)
            throw new Error('No active dashboard layout');
        const response = await axios.post(`/api/dashboards/${this.currentLayout.id}/widgets`, widget);
        this.currentLayout.widgets.push(response.data);
        return response.data;
    }
    async updateWidget(id, config) {
        if (!this.currentLayout)
            throw new Error('No active dashboard layout');
        const response = await axios.put(`/api/dashboards/${this.currentLayout.id}/widgets/${id}`, config);
        const index = this.currentLayout.widgets.findIndex(w => w.id === id);
        if (index !== -1) {
            this.currentLayout.widgets[index] = response.data;
        }
        return response.data;
    }
    async deleteWidget(id) {
        if (!this.currentLayout)
            throw new Error('No active dashboard layout');
        await axios.delete(`/api/dashboards/${this.currentLayout.id}/widgets/${id}`);
        this.currentLayout.widgets = this.currentLayout.widgets.filter(w => w.id !== id);
    }
    // 테마 관리
    async saveTheme(theme) {
        if (!this.currentLayout)
            throw new Error('No active dashboard layout');
        await axios.put(`/api/dashboards/${this.currentLayout.id}/theme`, theme);
        this.currentLayout.theme = theme;
    }
    // 메트릭 단위 관리
    getMetricUnits() {
        return Array.from(this.metricUnits.values());
    }
    getMetricUnit(id) {
        return this.metricUnits.get(id);
    }
    addMetricUnit(unit) {
        this.metricUnits.set(unit.id, unit);
    }
    formatMetricValue(value, unitId) {
        const unit = this.metricUnits.get(unitId);
        if (!unit)
            return value.toString();
        return unit.format(unit.conversion(value));
    }
}
