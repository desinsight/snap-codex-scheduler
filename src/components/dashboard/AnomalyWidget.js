import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AnomalyService } from '../../services/AnomalyService';
export const AnomalyWidget = ({ timeRange = '24h', severity = 'all' }) => {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        warning: 0
    });
    useEffect(() => {
        loadAnomalies();
    }, [timeRange, severity]);
    const loadAnomalies = async () => {
        try {
            setLoading(true);
            const anomalyService = AnomalyService.getInstance();
            const data = await anomalyService.getAnomalies(timeRange, severity);
            setAnomalies(data.anomalies);
            setStats(data.stats);
            setLoading(false);
        }
        catch (err) {
            setError('이상 징후 데이터를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return '#dc3545';
            case 'warning':
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };
    if (loading) {
        return _jsx("div", { className: "anomaly-widget loading", children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "anomaly-widget error", children: error });
    }
    return (_jsxs("div", { className: "anomaly-widget", children: [_jsxs("div", { className: "header", children: [_jsx("h3", { children: "\uC774\uC0C1 \uC9D5\uD6C4 \uBAA8\uB2C8\uD130\uB9C1" }), _jsxs("div", { className: "stats", children: [_jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "label", children: "\uC804\uCCB4" }), _jsx("span", { className: "value", children: stats.total })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "label", children: "\uC704\uD5D8" }), _jsx("span", { className: "value critical", children: stats.critical })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "label", children: "\uACBD\uACE0" }), _jsx("span", { className: "value warning", children: stats.warning })] })] })] }), _jsx("div", { className: "anomalies-list", children: anomalies.map(anomaly => (_jsxs("div", { className: "anomaly-item", style: { borderLeft: `4px solid ${getSeverityColor(anomaly.severity)}` }, children: [_jsxs("div", { className: "anomaly-content", children: [_jsx("h4", { children: anomaly.title }), _jsx("p", { children: anomaly.description }), _jsxs("div", { className: "meta", children: [_jsx("span", { className: "timestamp", children: new Date(anomaly.timestamp).toLocaleString() }), _jsx("span", { className: "source", children: anomaly.source })] })] }), _jsxs("div", { className: "actions", children: [_jsx("button", { className: "action-button", children: "\uC870\uCE58" }), _jsx("button", { className: "action-button", children: "\uBB34\uC2DC" })] })] }, anomaly.id))) }), _jsx("style", { jsx: true, children: `
        .anomaly-widget {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-item .label {
          font-size: 0.9em;
          color: #666;
        }

        .stat-item .value {
          font-size: 1.5em;
          font-weight: bold;
        }

        .stat-item .value.critical {
          color: #dc3545;
        }

        .stat-item .value.warning {
          color: #ffc107;
        }

        .anomalies-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .anomaly-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .anomaly-content {
          flex: 1;
        }

        .anomaly-content h4 {
          margin: 0 0 5px 0;
          font-size: 1.1em;
        }

        .meta {
          display: flex;
          gap: 10px;
          margin-top: 5px;
          font-size: 0.9em;
          color: #666;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .action-button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
        }

        .action-button:hover {
          background: #f8f9fa;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .error {
          color: #dc3545;
          padding: 20px;
          text-align: center;
        }
      ` })] }));
};
