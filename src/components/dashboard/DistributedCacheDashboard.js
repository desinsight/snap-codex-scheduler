import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { DistributedCacheService } from '../../services/DistributedCacheService';
import { HeatmapWidget } from './HeatmapWidget';
import { NodeGraphWidget } from './NodeGraphWidget';
export const DistributedCacheDashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('24h');
    useEffect(() => {
        loadMetrics();
    }, [timeRange]);
    const loadMetrics = async () => {
        try {
            setLoading(true);
            const cacheService = DistributedCacheService.getInstance();
            const cacheMetrics = await cacheService.getMetrics(timeRange);
            setMetrics(cacheMetrics);
            setLoading(false);
        }
        catch (err) {
            setError('캐시 메트릭을 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };
    if (loading) {
        return _jsx("div", { className: "cache-dashboard loading", children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "cache-dashboard error", children: error });
    }
    return (_jsxs("div", { className: "cache-dashboard", children: [_jsxs("div", { className: "header", children: [_jsx("h2", { children: "\uBD84\uC0B0 \uCE90\uC2DC \uB300\uC2DC\uBCF4\uB4DC" }), _jsx("div", { className: "controls", children: _jsxs("select", { value: timeRange, onChange: e => setTimeRange(e.target.value), children: [_jsx("option", { value: "24h", children: "24\uC2DC\uAC04" }), _jsx("option", { value: "7d", children: "7\uC77C" }), _jsx("option", { value: "30d", children: "30\uC77C" })] }) })] }), _jsxs("div", { className: "metrics-grid", children: [_jsxs("div", { className: "metric-card", children: [_jsx("h3", { children: "\uCE90\uC2DC \uD788\uD2B8\uC728" }), _jsxs("div", { className: "metric-value", children: [metrics?.hitRate.rate.toFixed(2), "%"] }), _jsxs("div", { className: "metric-trend", children: [_jsxs("span", { className: metrics?.hitRate.trend === 'up' ? 'up' : 'down', children: [metrics?.hitRate.change.toFixed(2), "%"] }), _jsx("span", { children: "vs \uC774\uC804 \uAE30\uAC04" })] })] }), _jsxs("div", { className: "metric-card", children: [_jsx("h3", { children: "\uD3C9\uADE0 \uC751\uB2F5 \uC2DC\uAC04" }), _jsxs("div", { className: "metric-value", children: [metrics?.latency.average.toFixed(2), "ms"] }), _jsxs("div", { className: "metric-trend", children: [_jsxs("span", { className: metrics?.latency.trend === 'up' ? 'up' : 'down', children: [metrics?.latency.change.toFixed(2), "%"] }), _jsx("span", { children: "vs \uC774\uC804 \uAE30\uAC04" })] })] }), _jsxs("div", { className: "metric-card", children: [_jsx("h3", { children: "\uCE90\uC2DC \uC0AC\uC6A9\uB7C9" }), _jsxs("div", { className: "metric-value", children: [metrics?.memory.usage.toFixed(2), "%"] }), _jsxs("div", { className: "metric-trend", children: [_jsxs("span", { className: metrics?.memory.trend === 'up' ? 'up' : 'down', children: [metrics?.memory.change.toFixed(2), "%"] }), _jsx("span", { children: "vs \uC774\uC804 \uAE30\uAC04" })] })] }), _jsxs("div", { className: "metric-card", children: [_jsx("h3", { children: "\uCE90\uC2DC \uD56D\uBAA9 \uC218" }), _jsx("div", { className: "metric-value", children: metrics?.items.count.toLocaleString() }), _jsxs("div", { className: "metric-trend", children: [_jsx("span", { className: metrics?.items.trend === 'up' ? 'up' : 'down', children: metrics?.items.change.toLocaleString() }), _jsx("span", { children: "vs \uC774\uC804 \uAE30\uAC04" })] })] })] }), _jsxs("div", { className: "widgets-grid", children: [_jsx("div", { className: "widget", children: _jsx(HeatmapWidget, { timeRange: timeRange, metric: "requests" }) }), _jsx("div", { className: "widget", children: _jsx(NodeGraphWidget, { timeRange: timeRange }) })] }), _jsx("style", { jsx: true, children: `
        .cache-dashboard {
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .metric-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .metric-card h3 {
          margin: 0 0 10px 0;
          font-size: 1.1em;
          color: #666;
        }

        .metric-value {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.9em;
          color: #666;
        }

        .metric-trend .up {
          color: #dc3545;
        }

        .metric-trend .down {
          color: #28a745;
        }

        .widgets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }

        .widget {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
