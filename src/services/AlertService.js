import axios from 'axios';
export class AlertService {
    static instance;
    channelConfigs = new Map();
    constructor() { }
    static getInstance() {
        if (!AlertService.instance) {
            AlertService.instance = new AlertService();
        }
        return AlertService.instance;
    }
    // 알림 규칙 관리
    async createRule(rule) {
        const response = await axios.post('/api/alerts/rules', rule);
        return response.data;
    }
    async updateRule(id, rule) {
        const response = await axios.put(`/api/alerts/rules/${id}`, rule);
        return response.data;
    }
    async deleteRule(id) {
        await axios.delete(`/api/alerts/rules/${id}`);
    }
    async getRules() {
        const response = await axios.get('/api/alerts/rules');
        return response.data;
    }
    async getRule(id) {
        const response = await axios.get(`/api/alerts/rules/${id}`);
        return response.data;
    }
    // 알림 발송
    async sendEmail(recipients, subject, body) {
        await axios.post('/api/alerts/channels/email', {
            recipients,
            subject,
            body
        });
    }
    async sendSlack(webhookUrl, channel, message) {
        await axios.post(webhookUrl, {
            channel,
            text: message
        });
    }
    async sendWebhook(url, headers, payload) {
        await axios.post(url, payload, { headers });
    }
    async sendInApp(notification) {
        await axios.post('/api/alerts/channels/inapp', notification);
    }
    async sendNotification(notification) {
        const rule = await this.getRule(notification.ruleId);
        const promises = [];
        for (const channel of rule.channels) {
            const config = this.channelConfigs.get(channel);
            if (!config)
                continue;
            switch (channel) {
                case 'email':
                    if (config.email) {
                        promises.push(this.sendEmail(config.email.recipients, `[${notification.priority}] ${notification.message}`, this.formatEmailBody(notification)));
                    }
                    break;
                case 'slack':
                    if (config.slack) {
                        promises.push(this.sendSlack(config.slack.webhookUrl, config.slack.channel, this.formatSlackMessage(notification)));
                    }
                    break;
                case 'webhook':
                    if (config.webhook) {
                        promises.push(this.sendWebhook(config.webhook.url, config.webhook.headers || {}, notification));
                    }
                    break;
                case 'inApp':
                    promises.push(this.sendInApp(notification));
                    break;
            }
        }
        await Promise.all(promises);
    }
    // 채널 설정 관리
    async setChannelConfig(channel, config) {
        await axios.post(`/api/alerts/channels/${channel}/config`, config);
        this.channelConfigs.set(channel, config);
    }
    async getChannelConfig(channel) {
        const response = await axios.get(`/api/alerts/channels/${channel}/config`);
        const config = response.data;
        this.channelConfigs.set(channel, config);
        return config;
    }
    // 알림 테스트
    async testChannel(channel) {
        try {
            const testNotification = {
                id: 'test',
                ruleId: 'test',
                message: 'This is a test notification',
                priority: 'low',
                status: 'active',
                timestamp: new Date().toISOString(),
                metadata: {
                    metric: 'test',
                    value: 0,
                    threshold: 0
                }
            };
            await this.sendNotification({
                ...testNotification,
                channels: [channel]
            });
            return true;
        }
        catch (error) {
            console.error(`Failed to test ${channel}:`, error);
            return false;
        }
    }
    // 헬퍼 메서드
    formatEmailBody(notification) {
        return `
      Alert: ${notification.message}
      Priority: ${notification.priority}
      Metric: ${notification.metadata.metric}
      Value: ${notification.metadata.value}
      Threshold: ${notification.metadata.threshold}
      Time: ${new Date(notification.timestamp).toLocaleString()}
    `;
    }
    formatSlackMessage(notification) {
        const color = this.getPriorityColor(notification.priority);
        return JSON.stringify({
            attachments: [{
                    color,
                    title: notification.message,
                    fields: [
                        { title: 'Priority', value: notification.priority, short: true },
                        { title: 'Metric', value: notification.metadata.metric, short: true },
                        { title: 'Value', value: notification.metadata.value.toString(), short: true },
                        { title: 'Threshold', value: notification.metadata.threshold.toString(), short: true }
                    ],
                    footer: new Date(notification.timestamp).toLocaleString()
                }]
        });
    }
    getPriorityColor(priority) {
        switch (priority) {
            case 'critical': return '#ff0000';
            case 'high': return '#ffa500';
            case 'medium': return '#ffff00';
            case 'low': return '#00ff00';
            default: return '#808080';
        }
    }
}
