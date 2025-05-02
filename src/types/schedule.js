export var ScheduleCategory;
(function (ScheduleCategory) {
    ScheduleCategory["WORK"] = "WORK";
    ScheduleCategory["PERSONAL"] = "PERSONAL";
    ScheduleCategory["EDUCATION"] = "EDUCATION";
    ScheduleCategory["HEALTH"] = "HEALTH";
    ScheduleCategory["OTHER"] = "OTHER";
})(ScheduleCategory || (ScheduleCategory = {}));
export var SchedulePriority;
(function (SchedulePriority) {
    SchedulePriority["LOW"] = "LOW";
    SchedulePriority["MEDIUM"] = "MEDIUM";
    SchedulePriority["HIGH"] = "HIGH";
    SchedulePriority["URGENT"] = "URGENT";
})(SchedulePriority || (SchedulePriority = {}));
export var ScheduleStatus;
(function (ScheduleStatus) {
    ScheduleStatus["PENDING"] = "PENDING";
    ScheduleStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ScheduleStatus["COMPLETED"] = "COMPLETED";
    ScheduleStatus["CANCELLED"] = "CANCELLED";
})(ScheduleStatus || (ScheduleStatus = {}));
export var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "email";
    NotificationType["PUSH"] = "push";
    NotificationType["SMS"] = "sms";
    NotificationType["IN_APP"] = "in_app";
})(NotificationType || (NotificationType = {}));
