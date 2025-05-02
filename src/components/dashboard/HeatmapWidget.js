import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { HeatmapService } from '../../services/HeatmapService';
export const HeatmapWidget = ({ timeRange = '24h', metric = 'requests' }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCell, setHoveredCell] = useState(null);
    useEffect(() => {
        loadHeatmapData();
    }, [timeRange, metric]);
    const loadHeatmapData = async () => {
        try {
            setLoading(true);
            const heatmapService = HeatmapService.getInstance();
            const heatmapData = await heatmapService.getHeatmapData(timeRange, metric);
            setData(heatmapData);
            setLoading(false);
        }
        catch (err) {
            setError('히트맵 데이터를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };
    const getColorScale = (value, max) => {
        const ratio = value / max;
        if (ratio < 0.2)
            return '#ebedf0';
        if (ratio < 0.4)
            return '#9be9a8';
        if (ratio < 0.6)
            return '#40c463';
        if (ratio < 0.8)
            return '#30a14e';
        return '#216e39';
    };
    const getMaxValue = () => {
        return Math.max(...data.map(d => d.value));
    };
    if (loading) {
        return _jsx("div", { className: "heatmap-widget loading", children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "heatmap-widget error", children: error });
    }
    const maxValue = getMaxValue();
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = Array.from({ length: 7 }, (_, i) => i);
    return (_jsxs("div", { className: "heatmap-widget", children: [_jsxs("div", { className: "header", children: [_jsx("h3", { children: "\uD65C\uB3D9 \uD788\uD2B8\uB9F5" }), _jsxs("div", { className: "legend", children: [_jsx("span", { children: "\uB0AE\uC74C" }), _jsx("div", { className: "color-scale", children: [0.2, 0.4, 0.6, 0.8, 1].map(ratio => (_jsx("div", { className: "color-box", style: { backgroundColor: getColorScale(ratio, 1) } }, ratio))) }), _jsx("span", { children: "\uB192\uC74C" })] })] }), _jsxs("div", { className: "heatmap-container", children: [_jsx("div", { className: "y-axis", children: ['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (_jsx("div", { className: "y-label", children: day }, i))) }), _jsx("div", { className: "heatmap", children: days.map(day => (_jsx("div", { className: "row", children: hours.map(hour => {
                                const cellData = data.find(d => d.day === day && d.hour === hour);
                                const value = cellData?.value || 0;
                                return (_jsx("div", { className: "cell", style: { backgroundColor: getColorScale(value, maxValue) }, onMouseEnter: () => setHoveredCell({ x: hour, y: day, value }), onMouseLeave: () => setHoveredCell(null) }, `${day}-${hour}`));
                            }) }, day))) }), _jsx("div", { className: "x-axis", children: hours.map(hour => (_jsx("div", { className: "x-label", children: hour }, hour))) })] }), hoveredCell && (_jsxs("div", { className: "tooltip", children: [_jsxs("div", { children: ["\uC2DC\uAC04: ", hoveredCell.x, "\uC2DC"] }), _jsxs("div", { children: ["\uC694\uC77C: ", ['일', '월', '화', '수', '목', '금', '토'][hoveredCell.y]] }), _jsxs("div", { children: ["\uAC12: ", hoveredCell.value] })] })), _jsx("style", { jsx: true, children: `
        .heatmap-widget {
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

        .legend {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .color-scale {
          display: flex;
          gap: 2px;
        }

        .color-box {
          width: 20px;
          height: 20px;
          border-radius: 2px;
        }

        .heatmap-container {
          display: flex;
          gap: 10px;
        }

        .y-axis {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .y-label {
          height: 20px;
          width: 20px;
          text-align: center;
          font-size: 0.8em;
          color: #666;
        }

        .heatmap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .row {
          display: flex;
          gap: 4px;
        }

        .cell {
          width: 20px;
          height: 20px;
          border-radius: 2px;
          cursor: pointer;
        }

        .x-axis {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }

        .x-label {
          width: 20px;
          text-align: center;
          font-size: 0.8em;
          color: #666;
        }

        .tooltip {
          position: absolute;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          font-size: 0.9em;
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
