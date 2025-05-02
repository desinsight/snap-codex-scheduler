import React, { useState, useEffect } from 'react';
import { HeatmapService } from '../../services/HeatmapService';
import { HeatmapData } from '../../types/heatmap';

interface HeatmapWidgetProps {
  timeRange?: '24h' | '7d' | '30d';
  metric?: 'requests' | 'errors' | 'latency';
}

export const HeatmapWidget: React.FC<HeatmapWidgetProps> = ({
  timeRange = '24h',
  metric = 'requests'
}) => {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; value: number } | null>(null);

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
    } catch (err) {
      setError('히트맵 데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const getColorScale = (value: number, max: number) => {
    const ratio = value / max;
    if (ratio < 0.2) return '#ebedf0';
    if (ratio < 0.4) return '#9be9a8';
    if (ratio < 0.6) return '#40c463';
    if (ratio < 0.8) return '#30a14e';
    return '#216e39';
  };

  const getMaxValue = () => {
    return Math.max(...data.map(d => d.value));
  };

  if (loading) {
    return <div className="heatmap-widget loading">Loading...</div>;
  }

  if (error) {
    return <div className="heatmap-widget error">{error}</div>;
  }

  const maxValue = getMaxValue();
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="heatmap-widget">
      <div className="header">
        <h3>활동 히트맵</h3>
        <div className="legend">
          <span>낮음</span>
          <div className="color-scale">
            {[0.2, 0.4, 0.6, 0.8, 1].map(ratio => (
              <div
                key={ratio}
                className="color-box"
                style={{ backgroundColor: getColorScale(ratio, 1) }}
              />
            ))}
          </div>
          <span>높음</span>
        </div>
      </div>

      <div className="heatmap-container">
        <div className="y-axis">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div key={i} className="y-label">{day}</div>
          ))}
        </div>
        <div className="heatmap">
          {days.map(day => (
            <div key={day} className="row">
              {hours.map(hour => {
                const cellData = data.find(d => d.day === day && d.hour === hour);
                const value = cellData?.value || 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="cell"
                    style={{ backgroundColor: getColorScale(value, maxValue) }}
                    onMouseEnter={() => setHoveredCell({ x: hour, y: day, value })}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="x-axis">
          {hours.map(hour => (
            <div key={hour} className="x-label">{hour}</div>
          ))}
        </div>
      </div>

      {hoveredCell && (
        <div className="tooltip">
          <div>시간: {hoveredCell.x}시</div>
          <div>요일: {['일', '월', '화', '수', '목', '금', '토'][hoveredCell.y]}</div>
          <div>값: {hoveredCell.value}</div>
        </div>
      )}

      <style jsx>{`
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
      `}</style>
    </div>
  );
}; 