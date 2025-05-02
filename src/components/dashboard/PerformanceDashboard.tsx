import React, { useState, useEffect } from 'react';
import { PerformanceService } from '../../services/PerformanceService';
import { PerformanceMetrics } from '../../types/performance';
import { AnomalyWidget } from './AnomalyWidget';
import { HeatmapWidget } from './HeatmapWidget';
import { NodeGraphWidget } from './NodeGraphWidget';

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const performanceService = PerformanceService.getInstance();
      const performanceMetrics = await performanceService.getMetrics(timeRange);
      setMetrics(performanceMetrics);
      setLoading(false);
    } catch (err) {
      setError('성능 메트릭을 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="performance-dashboard loading">Loading...</div>;
  }

  if (error) {
    return <div className="performance-dashboard error">{error}</div>;
  }

  return (
    <div className="performance-dashboard">
      <div className="header">
        <h2>성능 대시보드</h2>
        <div className="controls">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value as '24h' | '7d' | '30d')}
          >
            <option value="24h">24시간</option>
            <option value="7d">7일</option>
            <option value="30d">30일</option>
          </select>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>CPU 사용률</h3>
          <div className="metric-value">
            {metrics?.cpu.usage.toFixed(2)}%
          </div>
          <div className="metric-trend">
            <span className={metrics?.cpu.trend === 'up' ? 'up' : 'down'}>
              {metrics?.cpu.change.toFixed(2)}%
            </span>
            <span>vs 이전 기간</span>
          </div>
        </div>

        <div className="metric-card">
          <h3>메모리 사용률</h3>
          <div className="metric-value">
            {metrics?.memory.usage.toFixed(2)}%
          </div>
          <div className="metric-trend">
            <span className={metrics?.memory.trend === 'up' ? 'up' : 'down'}>
              {metrics?.memory.change.toFixed(2)}%
            </span>
            <span>vs 이전 기간</span>
          </div>
        </div>

        <div className="metric-card">
          <h3>평균 응답 시간</h3>
          <div className="metric-value">
            {metrics?.latency.average.toFixed(2)}ms
          </div>
          <div className="metric-trend">
            <span className={metrics?.latency.trend === 'up' ? 'up' : 'down'}>
              {metrics?.latency.change.toFixed(2)}%
            </span>
            <span>vs 이전 기간</span>
          </div>
        </div>

        <div className="metric-card">
          <h3>에러율</h3>
          <div className="metric-value">
            {metrics?.errorRate.rate.toFixed(2)}%
          </div>
          <div className="metric-trend">
            <span className={metrics?.errorRate.trend === 'up' ? 'up' : 'down'}>
              {metrics?.errorRate.change.toFixed(2)}%
            </span>
            <span>vs 이전 기간</span>
          </div>
        </div>
      </div>

      <div className="widgets-grid">
        <div className="widget">
          <AnomalyWidget timeRange={timeRange} />
        </div>
        <div className="widget">
          <HeatmapWidget timeRange={timeRange} metric="requests" />
        </div>
        <div className="widget">
          <NodeGraphWidget timeRange={timeRange} />
        </div>
      </div>

      <style jsx>{`
        .performance-dashboard {
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
      `}</style>
    </div>
  );
}; 