import React, { useEffect, useState } from 'react';
import { ServiceMetrics } from '../../services/utils/serviceUtils';
import { TaskService } from '../../services/api/task.service';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ServiceMetricsWithTimestamp extends ServiceMetrics {
  timestamp: number;
}

const PerformanceDashboard: React.FC = () => {
  const [metricsHistory, setMetricsHistory] = useState<ServiceMetricsWithTimestamp[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<ServiceMetrics | null>(null);

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

  if (!currentMetrics) return <div>Loading metrics...</div>;

  const cacheHitRate = currentMetrics.requestCount > 0
    ? (currentMetrics.cacheHits / currentMetrics.requestCount) * 100
    : 0;

  const errorRate = currentMetrics.requestCount > 0
    ? (currentMetrics.errorCount / currentMetrics.requestCount) * 100
    : 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">성능 모니터링 대시보드</h2>
      
      {/* 현재 메트릭스 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">요청 수</h3>
          <p className="text-3xl">{currentMetrics.requestCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">캐시 히트율</h3>
          <p className="text-3xl">{cacheHitRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">평균 응답 시간</h3>
          <p className="text-3xl">{currentMetrics.averageResponseTime.toFixed(2)}ms</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">에러율</h3>
          <p className="text-3xl">{errorRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* 시계열 차트 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">응답 시간 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="averageResponseTime"
                name="평균 응답 시간"
                stroke="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">요청 및 캐시 히트</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Legend />
              <Bar dataKey="requestCount" name="전체 요청" fill="#8884d8" />
              <Bar dataKey="cacheHits" name="캐시 히트" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 리셋 버튼 */}
      <div className="mt-6">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            TaskService.resetMetrics();
            setMetricsHistory([]);
            setCurrentMetrics(TaskService.getMetrics());
          }}
        >
          메트릭스 초기화
        </button>
      </div>
    </div>
  );
};

export default PerformanceDashboard; 