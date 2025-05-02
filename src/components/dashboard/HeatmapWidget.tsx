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

interface CacheAccess {
  address: number;
  timestamp: number;
  type: 'read' | 'write';
  value?: number;
}

interface Props {
  widget: WidgetConfig;
}

const HeatmapWidget: React.FC<Props> = ({ widget }) => {
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
        const data: CacheAccess[] = await response.json();

        renderHeatmap(data);
      } catch (error) {
        console.error('Failed to load heatmap data:', error);
      }
    };

    loadData();

    // 실시간 업데이트 설정
    if (widget.settings.refreshInterval) {
      const interval = setInterval(loadData, widget.settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.settings.query, widget.settings.refreshInterval]);

  const renderHeatmap = (data: CacheAccess[]) => {
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
    const addressExtent = d3.extent(data, d => d.address) as [number, number];

    // x축 스케일 (시간)
    const x = d3
      .scaleTime()
      .domain(timeExtent)
      .range([margin.left, width - margin.right]);

    // y축 스케일 (주소)
    const y = d3
      .scaleLinear()
      .domain(addressExtent)
      .range([height - margin.bottom, margin.top]);

    // 색상 스케일
    const color = d3
      .scaleSequential()
      .interpolator(d3.interpolateRdYlBu)
      .domain([0, d3.max(data, d => d.value || 1) || 1]);

    // 히트맵 그리기
    const cellSize = 10;
    const cells = svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.timestamp))
      .attr('y', d => y(d.address))
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('fill', d => color(d.value || 1))
      .attr('stroke', 'none')
      .attr('rx', 2)
      .attr('ry', 2);

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
      .text('Address');

    // 툴크 이벤트
    cells
      .on('mouseover', (event, d) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = event.pageX + 'px';
          tooltipRef.current.style.top = event.pageY + 'px';
          tooltipRef.current.innerHTML = `
            <div>Address: ${d.address}</div>
            <div>Time: ${new Date(d.timestamp).toLocaleString()}</div>
            <div>Type: ${d.type}</div>
            ${d.value ? `<div>Value: ${d.value}</div>` : ''}
          `;
        }
      })
      .on('mouseout', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      });

    // 범례 추가
    const legendWidth = 200;
    const legendHeight = 20;
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - legendWidth - margin.right},${margin.top})`);

    const defs = svg.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'heatmap-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    linearGradient
      .selectAll('stop')
      .data(color.ticks(5))
      .enter()
      .append('stop')
      .attr('offset', (d, i) => i / 4)
      .attr('stop-color', d => color(d));

    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#heatmap-gradient)');

    const legendScale = d3
      .scaleLinear()
      .domain(color.domain())
      .range([0, legendWidth]);

    const legendAxis = d3
      .axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d => d.toString());

    legend
      .append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis);
  };

  return (
    <Container ref={containerRef}>
      <svg ref={svgRef} />
      <Tooltip ref={tooltipRef} />
    </Container>
  );
};

export default HeatmapWidget; 