export class AnomalyService {
    static instance;
    anomalies = [];
    constructor() {
        // 초기 이상 징후 데이터 로드
        this.loadInitialData();
    }
    static getInstance() {
        if (!AnomalyService.instance) {
            AnomalyService.instance = new AnomalyService();
        }
        return AnomalyService.instance;
    }
    async loadInitialData() {
        try {
            // 실제 구현에서는 API에서 데이터를 가져와야 합니다
            const response = await fetch('/api/anomalies');
            this.anomalies = await response.json();
        }
        catch (error) {
            console.error('Failed to load initial anomaly data:', error);
        }
    }
    async getAnomalies(timeRange, severity) {
        try {
            // 시간 범위에 따른 필터링
            const now = new Date();
            const filteredAnomalies = this.anomalies.filter(anomaly => {
                const anomalyDate = new Date(anomaly.timestamp);
                const timeDiff = now.getTime() - anomalyDate.getTime();
                const hoursDiff = timeDiff / (1000 * 60 * 60);
                switch (timeRange) {
                    case '24h':
                        return hoursDiff <= 24;
                    case '7d':
                        return hoursDiff <= 24 * 7;
                    case '30d':
                        return hoursDiff <= 24 * 30;
                    default:
                        return true;
                }
            });
            // 심각도에 따른 필터링
            const severityFilteredAnomalies = severity === 'all'
                ? filteredAnomalies
                : filteredAnomalies.filter(anomaly => anomaly.severity === severity);
            // 통계 계산
            const stats = {
                total: severityFilteredAnomalies.length,
                critical: severityFilteredAnomalies.filter(a => a.severity === 'critical').length,
                warning: severityFilteredAnomalies.filter(a => a.severity === 'warning').length
            };
            return {
                anomalies: severityFilteredAnomalies,
                stats
            };
        }
        catch (error) {
            console.error('Failed to get anomalies:', error);
            throw error;
        }
    }
    async addAnomaly(anomaly) {
        try {
            const newAnomaly = {
                ...anomaly,
                id: crypto.randomUUID()
            };
            this.anomalies.push(newAnomaly);
            return newAnomaly;
        }
        catch (error) {
            console.error('Failed to add anomaly:', error);
            throw error;
        }
    }
    async updateAnomaly(id, updates) {
        try {
            const index = this.anomalies.findIndex(a => a.id === id);
            if (index === -1) {
                throw new Error('Anomaly not found');
            }
            this.anomalies[index] = {
                ...this.anomalies[index],
                ...updates
            };
            return this.anomalies[index];
        }
        catch (error) {
            console.error('Failed to update anomaly:', error);
            throw error;
        }
    }
    async deleteAnomaly(id) {
        try {
            this.anomalies = this.anomalies.filter(a => a.id !== id);
        }
        catch (error) {
            console.error('Failed to delete anomaly:', error);
            throw error;
        }
    }
}
