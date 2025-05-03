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
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  padding: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1000;
`;

const Legend = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.shape.borderRadius.small};
  padding: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${({ color }) => color};
  margin-right: 8px;
  border-radius: 2px;
`;

interface PredictionPoint {
  timestamp: number;
  actual?: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
  trend?: 'up' | 'down' | 'stable';
}

interface Props {
  widget: WidgetConfig;
}

const PredictionWidget: React.FC<Props> = ({ widget }) => {
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
        const data: PredictionPoint[] = await response.json();

        renderPredictionChart(data);
      } catch (error) {
        console.error('Failed to load prediction data:', error);
      }
    };

    loadData();

    // 실시간 업데이트 설정
    if (widget.settings.refreshInterval) {
      const interval = setInterval(loadData, widget.settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.settings.query, widget.settings.refreshInterval]);

  const renderPredictionChart = (data: PredictionPoint[]) => {
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
    const valueExtent = [
      d3.min(data, d => Math.min(d.lowerBound, d.actual || Infinity)) || 0,
      d3.max(data, d => Math.max(d.upperBound, d.actual || -Infinity)) || 1
    ];

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

    // 신뢰 구간 영역 그리기
    const confidenceArea = d3
      .area<PredictionPoint>()
      .x(d => x(d.timestamp))
      .y0(d => y(d.lowerBound))
      .y1(d => y(d.upperBound));

    svg
      .append('path')
      .datum(data)
      .attr('fill', '#e6f3ff')
      .attr('stroke', 'none')
      .attr('d', confidenceArea);

    // 실제 값 라인 그리기 (있는 경우)
    if (data.some(d => d.actual !== undefined)) {
      const actualLine = d3
        .line<PredictionPoint>()
        .x(d => x(d.timestamp))
        .y(d => y(d.actual!));

      svg
        .append('path')
        .datum(data.filter(d => d.actual !== undefined))
        .attr('fill', 'none')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .attr('d', actualLine);
    }

    // 예측 값 라인 그리기
    const predictedLine = d3
      .line<PredictionPoint>()
      .x(d => x(d.timestamp))
      .y(d => y(d.predicted));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4d94ff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('d', predictedLine);

    // 트렌드 표시
    const trendPoints = data.filter(d => d.trend);
    svg
      .selectAll('circle')
      .data(trendPoints)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.predicted))
      .attr('r', 4)
      .attr('fill', d => {
        switch (d.trend) {
          case 'up':
            return '#4CAF50';
          case 'down':
            return '#F44336';
          default:
            return '#FFC107';
        }
      });

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

    // 툴팁 이벤트
    svg
      .selectAll('circle')
      .on('mouseover', (event, d) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = event.pageX + 'px';
          tooltipRef.current.style.top = event.pageY + 'px';
          tooltipRef.current.innerHTML = `
            <div>Time: ${new Date(d.timestamp).toLocaleString()}</div>
            <div>Predicted: ${d.predicted.toFixed(2)}</div>
            ${d.actual !== undefined ? `<div>Actual: ${d.actual.toFixed(2)}</div>` : ''}
            <div>Confidence: ${(d.confidence * 100).toFixed(2)}%</div>
            <div>Trend: ${d.trend}</div>
          `;
        }
      })
      .on('mouseout', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      });

    // 범례 추가
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 200},${margin.top})`);

    const legendItems = [
      { label: 'Actual', color: '#333' },
      { label: 'Predicted', color: '#4d94ff' },
      { label: 'Confidence Interval', color: '#e6f3ff' },
      { label: 'Trend Up', color: '#4CAF50' },
      { label: 'Trend Down', color: '#F44336' },
      { label: 'Trend Stable', color: '#FFC107' }
    ];

    legendItems.forEach((item, i) => {
      const g = legend.append('g').attr('transform', `translate(0,${i * 20})`);

      g.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', item.color);

      g.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('dy', '0.35em')
        .text(item.label);
    });
  };

  return (
    <Container ref={containerRef}>
      <svg ref={svgRef} />
      <Tooltip ref={tooltipRef} />
    </Container>
  );
};

export default PredictionWidget; 