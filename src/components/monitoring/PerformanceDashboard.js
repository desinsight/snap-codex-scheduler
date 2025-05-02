import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { TaskService } from '../../services/api/task.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
const PerformanceDashboard = () => {
    const [metricsHistory, setMetricsHistory] = useState([]);
    const [currentMetrics, setCurrentMetrics] = useState(null);
    useEffect(() => {
        const updateMetrics = () => {
            const metrics = TaskService.getMetrics();
            setCurrentMetrics(metrics);
            setMetricsHistory(prev => [...prev, { ...metrics, timestamp: Date.now() }]);
        };
        updateMetrics();
        const interval = setInterval(updateMetrics, 5000); // 5초마다 업데이트
        return () => clearInterval(interval);
    }, []);
    if (!currentMetrics)
        return _jsx("div", { children: "Loading metrics..." });
    const cacheHitRate = currentMetrics.requestCount > 0
        ? (currentMetrics.cacheHits / currentMetrics.requestCount) * 100
        : 0;
    const errorRate = currentMetrics.requestCount > 0
        ? (currentMetrics.errorCount / currentMetrics.requestCount) * 100
        : 0;
    return (_jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "\uC131\uB2A5 \uBAA8\uB2C8\uD130\uB9C1 \uB300\uC2DC\uBCF4\uB4DC" }), _jsxs("div", { className: "grid grid-cols-4 gap-4 mb-8", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\uC694\uCCAD \uC218" }), _jsx("p", { className: "text-3xl", children: currentMetrics.requestCount })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\uCE90\uC2DC \uD788\uD2B8\uC728" }), _jsxs("p", { className: "text-3xl", children: [cacheHitRate.toFixed(1), "%"] })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\uD3C9\uADE0 \uC751\uB2F5 \uC2DC\uAC04" }), _jsxs("p", { className: "text-3xl", children: [currentMetrics.averageResponseTime.toFixed(2), "ms"] })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "\uC5D0\uB7EC\uC728" }), _jsxs("p", { className: "text-3xl", children: [errorRate.toFixed(1), "%"] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uC751\uB2F5 \uC2DC\uAC04 \uCD94\uC774" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: metricsHistory, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: (timestamp) => new Date(timestamp).toLocaleTimeString() }), _jsx(YAxis, {}), _jsx(Tooltip, { labelFormatter: (timestamp) => new Date(timestamp).toLocaleTimeString() }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "averageResponseTime", name: "\uD3C9\uADE0 \uC751\uB2F5 \uC2DC\uAC04", stroke: "#8884d8" })] }) })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uC694\uCCAD \uBC0F \uCE90\uC2DC \uD788\uD2B8" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: metricsHistory, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: (timestamp) => new Date(timestamp).toLocaleTimeString() }), _jsx(YAxis, {}), _jsx(Tooltip, { labelFormatter: (timestamp) => new Date(timestamp).toLocaleTimeString() }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "requestCount", name: "\uC804\uCCB4 \uC694\uCCAD", fill: "#8884d8" }), _jsx(Bar, { dataKey: "cacheHits", name: "\uCE90\uC2DC \uD788\uD2B8", fill: "#82ca9d" })] }) })] })] }), _jsx("div", { className: "mt-6", children: _jsx("button", { className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600", onClick: () => {
                        TaskService.resetMetrics();
                        setMetricsHistory([]);
                        setCurrentMetrics(TaskService.getMetrics());
                    }, children: "\uBA54\uD2B8\uB9AD\uC2A4 \uCD08\uAE30\uD654" }) })] }));
};
export default PerformanceDashboard;
