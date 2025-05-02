export var NotificationType;
(function (NotificationType) {
    NotificationType["PUSH"] = "PUSH";
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["SMS"] = "SMS";
    NotificationType["IN_APP"] = "IN_APP";
})(NotificationType || (NotificationType = {}));
export var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["MEDIUM"] = "MEDIUM";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (NotificationPriority = {}));
export var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "PENDING";
    NotificationStatus["SENT"] = "SENT";
    NotificationStatus["DELIVERED"] = "DELIVERED";
    NotificationStatus["READ"] = "READ";
    NotificationStatus["FAILED"] = "FAILED";
})(NotificationStatus || (NotificationStatus = {}));
export var ScheduleCategory;
(function (ScheduleCategory) {
    ScheduleCategory["WORK"] = "work";
    ScheduleCategory["PERSONAL"] = "personal";
    ScheduleCategory["EDUCATION"] = "education";
    ScheduleCategory["HEALTH"] = "health";
    ScheduleCategory["SYSTEM"] = "system";
})(ScheduleCategory || (ScheduleCategory = {}));
// 기본 알림 템플릿
export const defaultTemplates = [
    {
        id: 'task-assigned',
        name: 'Task Assigned',
        type: NotificationType.EMAIL,
        subject: 'New Task Assigned',
        content: 'A new task has been assigned to you',
        variables: ['taskName', 'assignerName'],
        isDefault: true,
        versions: [],
        usage: {
            total: 0,
            success: 0,
            failed: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'task-completed',
        name: 'Task Completed',
        type: NotificationType.EMAIL,
        subject: 'Task Completed',
        content: 'A task has been marked as completed',
        variables: ['taskName', 'completerName'],
        isDefault: true,
        versions: [],
        usage: {
            total: 0,
            success: 0,
            failed: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'schedule-reminder',
        name: 'Schedule Reminder',
        type: NotificationType.EMAIL,
        subject: 'Upcoming Schedule',
        content: 'A schedule is coming up soon',
        variables: ['scheduleTitle', 'startTime'],
        isDefault: true,
        versions: [],
        usage: {
            total: 0,
            success: 0,
            failed: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'system-alert',
        name: 'System Alert',
        type: NotificationType.EMAIL,
        subject: 'System Alert',
        content: 'An important system alert has been issued',
        variables: ['alertType', 'severity'],
        isDefault: true,
        versions: [],
        usage: {
            total: 0,
            success: 0,
            failed: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
