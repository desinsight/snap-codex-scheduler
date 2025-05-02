class WebhookService {
    webhooks;
    eventQueue;
    processing;
    constructor() {
        this.webhooks = new Map();
        this.eventQueue = [];
        this.processing = false;
    }
    async registerWebhook(config) {
        this.webhooks.set(config.url, config);
    }
    async unregisterWebhook(url) {
        this.webhooks.delete(url);
    }
    async processEvent(event) {
        this.eventQueue.push(event);
        if (!this.processing) {
            await this.processQueue();
        }
    }
    async processQueue() {
        if (this.processing || this.eventQueue.length === 0)
            return;
        this.processing = true;
        try {
            while (this.eventQueue.length > 0) {
                const event = this.eventQueue.shift();
                if (!event)
                    continue;
                await this.dispatchEvent(event);
            }
        }
        finally {
            this.processing = false;
        }
    }
    async dispatchEvent(event) {
        for (const [url, config] of this.webhooks.entries()) {
            if (config.events.includes(event.type)) {
                try {
                    await this.sendWebhook(url, config, event);
                }
                catch (error) {
                    console.error(`Failed to send webhook to ${url}:`, error);
                    await this.handleRetry(url, config, event);
                }
            }
        }
    }
    async sendWebhook(url, config, event) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Secret': config.secret,
                'X-Event-Type': event.type,
                'X-Event-ID': event.id,
            },
            body: JSON.stringify(event.payload),
        });
        if (!response.ok) {
            throw new Error(`Webhook request failed with status ${response.status}`);
        }
    }
    async handleRetry(url, config, event) {
        const maxAttempts = config.retryPolicy.maxAttempts;
        const backoffInterval = config.retryPolicy.backoffInterval;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await new Promise(resolve => setTimeout(resolve, backoffInterval * attempt));
                await this.sendWebhook(url, config, event);
                return;
            }
            catch (error) {
                console.error(`Retry attempt ${attempt} failed:`, error);
                if (attempt === maxAttempts) {
                    throw new Error(`All retry attempts failed for webhook ${url}`);
                }
            }
        }
    }
    getWebhookConfig(url) {
        return this.webhooks.get(url);
    }
    getAllWebhooks() {
        return Array.from(this.webhooks.values());
    }
}
export const webhookService = new WebhookService();
