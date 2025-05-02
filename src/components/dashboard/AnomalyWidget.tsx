import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as d3 from 'd3';
import { WidgetConfig } from '../../types/dashboard';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1000;
`;

const Alert = styled.div<{ severity: 'low' | 'medium' | 'high' }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, severity }) => {
    switch (severity) {
      case 'low':
        return theme.colors.warning;
      case 'medium':
        return theme.colors.error;
      case 'high':
        return theme.colors.danger;
      default:
        return theme.colors.surface;
    }
  }};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: bold;
`;

interface DataPoint {
  timestamp: number;
  value: number;
  isAnomaly?: boolean;
  confidence?: number;
  expectedValue?: number;
  lowerBound?: number;
  upperBound?: number;
}

interface Props {
  widget: WidgetConfig;
}

const AnomalyWidget: React.FC<Props> = ({ widget }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const loadData = async () => {
      try {
        // 실제 구현에서는 API에서 데이터를 가져와야 합니다
        const response = await fetch(widget.settings.query || '');
        const data: DataPoint[] = await response.json();

        renderAnomalyChart(data);
      } catch (error) {
        console.error('Failed to load anomaly data:', error);
      }
    };

    loadData();

    // 실시간 업데이트 설정
    if (widget.settings.refreshInterval) {
      const interval = setInterval(loadData, widget.settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.settings.query, widget.settings.refreshInterval]);

  const renderAnomalyChart = (data: DataPoint[]) => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // SVG 초기화
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // 데이터 전처리
    const timeExtent = d3.extent(data, d => d.timestamp) as [number, number];
    const valueExtent = d3.extent(data, d => d.value) as [number, number];

    // x축 스케일 (시간)
    const x = d3
      .scaleTime()
      .domain(timeExtent)
      .range([margin.left, width - margin.right]);

    // y축 스케일 (값)
    const y = d3
      .scaleLinear()
      .domain(valueExtent)
      .range([height - margin.bottom, margin.top]);

    // 예상 값 영역 그리기
    if (data[0]?.expectedValue && data[0]?.lowerBound && data[0]?.upperBound) {
      const area = d3
        .area<DataPoint>()
        .x(d => x(d.timestamp))
        .y0(d => y(d.lowerBound!))
        .y1(d => y(d.upperBound!));

      svg
        .append('path')
        .datum(data)
        .attr('fill', '#e6f3ff')
        .attr('stroke', 'none')
        .attr('d', area);
    }

    // 예상 값 라인 그리기
    if (data[0]?.expectedValue) {
      const line = d3
        .line<DataPoint>()
        .x(d => x(d.timestamp))
        .y(d => y(d.expectedValue!));

      svg
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#4d94ff')
        .attr('stroke-width', 2)
        .attr('d', line);
    }

    // 실제 값 라인 그리기
    const valueLine = d3
      .line<DataPoint>()
      .x(d => x(d.timestamp))
      .y(d => y(d.value));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('d', valueLine);

    // 이상 징후 포인트 그리기
    const anomalies = data.filter(d => d.isAnomaly);
    svg
      .selectAll('circle')
      .data(anomalies)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.value))
      .attr('r', 5)
      .attr('fill', '#ff4d4d')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // 축 추가
    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y).ticks(5);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

    // 축 레이블 추가
    svg
      .append('text')
      .attr('transform', `translate(${width / 2},${height - margin.bottom / 2})`)
      .style('text-anchor', 'middle')
      .text('Time');

    svg
      .append('text')
      .attr('transform', `translate(${margin.left / 2},${height / 2}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .text('Value');

    // 툴크 이벤트
    svg
      .selectAll('circle')
      .on('mouseover', (event, d) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = event.pageX + 'px';
          tooltipRef.current.style.top = event.pageY + 'px';
          tooltipRef.current.innerHTML = `
            <div>Time: ${new Date(d.timestamp).toLocaleString()}</div>
            <div>Value: ${d.value}</div>
            <div>Expected: ${d.expectedValue}</div>
            <div>Confidence: ${(d.confidence! * 100).toFixed(2)}%</div>
          `;
        }
      })
      .on('mouseout', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      });

    // 이상 징후 통계 계산
    const anomalyCount = anomalies.length;
    const totalCount = data.length;
    const anomalyRate = anomalyCount / totalCount;

    // 이상 징후 심각도 결정
    let severity: 'low' | 'medium' | 'high' = 'low';
    if (anomalyRate > 0.1) {
      severity = 'high';
    } else if (anomalyRate > 0.05) {
      severity = 'medium';
    }

    // 이상 징후 알림 표시
    if (anomalyCount > 0) {
      const alert = svg
        .append('g')
        .attr('transform', `translate(${width - 200},${margin.top})`);

      alert
        .append('rect')
        .attr('width', 180)
        .attr('height', 40)
        .attr('fill', severity === 'high' ? '#ff4d4d' : severity === 'medium' ? '#ffa64d' : '#ffd24d')
        .attr('rx', 4)
        .attr('ry', 4);

      alert
        .append('text')
        .attr('x', 90)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(`${anomalyCount} Anomalies Detected`);
    }
  };

  return (
    <Container ref={containerRef}>
      <svg ref={svgRef} />
      <Tooltip ref={tooltipRef} />
    </Container>
  );
};

export default AnomalyWidget; 