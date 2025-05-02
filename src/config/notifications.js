export const notificationConfig = {
    // 알림 채널
    channels: {
        // 이메일 알림
        email: {
            enabled: true,
            provider: 'smtp',
            config: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            },
            recipients: process.env.NOTIFICATION_EMAILS?.split(',') || []
        },
        // Slack 알림
        slack: {
            enabled: true,
            webhookUrl: process.env.SLACK_WEBHOOK_URL,
            channel: '#alerts',
            username: 'Snap Codex Scheduler',
            iconEmoji: ':robot_face:'
        },
        // PagerDuty 알림
        pagerduty: {
            enabled: true,
            integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY,
            serviceId: process.env.PAGERDUTY_SERVICE_ID
        }
    },
    // 알림 규칙
    rules: {
        // 성능 알림
        performance: {
            // 응답 시간 알림
            responseTime: {
                threshold: 1000, // ms
                window: '5m',
                count: 3,
                channels: ['slack', 'email'],
                severity: 'warning'
            },
            // 오류율 알림
            errorRate: {
                threshold: 0.05, // 5%
                window: '5m',
                count: 3,
                channels: ['slack', 'email', 'pagerduty'],
                severity: 'critical'
            }
        },
        // 리소스 알림
        resources: {
            // CPU 사용량 알림
            cpu: {
                threshold: 80, // %
                window: '5m',
                count: 3,
                channels: ['slack', 'email'],
                severity: 'warning'
            },
            // 메모리 사용량 알림
            memory: {
                threshold: 85, // %
                window: '5m',
                count: 3,
                channels: ['slack', 'email', 'pagerduty'],
                severity: 'critical'
            }
        },
        // 캐시 알림
        cache: {
            // 캐시 히트율 알림
            hitRate: {
                threshold: 0.8, // 80%
                window: '5m',
                count: 3,
                channels: ['slack', 'email'],
                severity: 'warning'
            },
            // 캐시 크기 알림
            size: {
                threshold: 0.9, // 90%
                window: '5m',
                count: 3,
                channels: ['slack', 'email'],
                severity: 'warning'
            }
        }
    },
    // 알림 템플릿
    templates: {
        // 성능 알림 템플릿
        performance: {
            title: 'Performance Alert: {{metric}}',
            message: '{{metric}} has exceeded the threshold of {{threshold}} for {{count}} times in the last {{window}}.\nCurrent value: {{value}}'
        },
        // 리소스 알림 템플릿
        resources: {
            title: 'Resource Alert: {{resource}}',
            message: '{{resource}} usage has exceeded the threshold of {{threshold}}% for {{count}} times in the last {{window}}.\nCurrent usage: {{value}}%'
        },
        // 캐시 알림 템플릿
        cache: {
            title: 'Cache Alert: {{metric}}',
            message: 'Cache {{metric}} has exceeded the threshold of {{threshold}} for {{count}} times in the last {{window}}.\nCurrent value: {{value}}'
        }
    },
    // 알림 중복 제거
    deduplication: {
        enabled: true,
        // 중복 알림 간격 (ms)
        interval: 300000, // 5분
        // 중복 알림 그룹화
        groupBy: ['metric', 'severity']
    }
};
