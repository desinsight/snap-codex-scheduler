import React, { useState, useEffect } from 'react';
import { AnomalyService } from '../../services/AnomalyService';
import { Anomaly } from '../../types/anomaly';

interface AnomalyWidgetProps {
  timeRange?: '24h' | '7d' | '30d';
  severity?: 'all' | 'critical' | 'warning';
}

export const AnomalyWidget: React.FC<AnomalyWidgetProps> = ({
  timeRange = '24h',
  severity = 'all'
}) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    } catch (err) {
      setError('이상 징후 데이터를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
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
    return <div className="anomaly-widget loading">Loading...</div>;
  }

  if (error) {
    return <div className="anomaly-widget error">{error}</div>;
  }

  return (
    <div className="anomaly-widget">
      <div className="header">
        <h3>이상 징후 모니터링</h3>
        <div className="stats">
          <div className="stat-item">
            <span className="label">전체</span>
            <span className="value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="label">위험</span>
            <span className="value critical">{stats.critical}</span>
          </div>
          <div className="stat-item">
            <span className="label">경고</span>
            <span className="value warning">{stats.warning}</span>
          </div>
        </div>
      </div>

      <div className="anomalies-list">
        {anomalies.map(anomaly => (
          <div
            key={anomaly.id}
            className="anomaly-item"
            style={{ borderLeft: `4px solid ${getSeverityColor(anomaly.severity)}` }}
          >
            <div className="anomaly-content">
              <h4>{anomaly.title}</h4>
              <p>{anomaly.description}</p>
              <div className="meta">
                <span className="timestamp">
                  {new Date(anomaly.timestamp).toLocaleString()}
                </span>
                <span className="source">{anomaly.source}</span>
              </div>
            </div>
            <div className="actions">
              <button className="action-button">조치</button>
              <button className="action-button">무시</button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}; 