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

interface Node {
  id: string;
  name: string;
  type: string;
  value?: number;
  group?: string;
}

interface Link {
  source: string;
  target: string;
  value?: number;
  type?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface Props {
  widget: WidgetConfig;
}

const NodeGraphWidget: React.FC<Props> = ({ widget }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const loadData = async () => {
      try {
        // 실제 구현에서는 API에서 데이터를 가져와야 합니다
        const response = await fetch(widget.settings.query || '');
        const data: GraphData = await response.json();

        renderGraph(data);
      } catch (error) {
        console.error('Failed to load graph data:', error);
      }
    };

    loadData();

    // 실시간 업데이트 설정
    if (widget.settings.refreshInterval) {
      const interval = setInterval(loadData, widget.settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.settings.query, widget.settings.refreshInterval]);

  const renderGraph = (data: GraphData) => {
    if (!containerRef.current || !svgRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // SVG 초기화
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // 시뮬레이션 설정
    const simulation = d3
      .forceSimulation<Node>(data.nodes)
      .force(
        'link',
        d3
          .forceLink<Node, Link>(data.links)
          .id(d => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // 링크 그리기
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value || 1));

    // 노드 그리기
    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => Math.sqrt(d.value || 5) + 5)
      .attr('fill', d => {
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        return color(d.group || 'default');
      })
      .call(drag(simulation));

    // 노드 레이블 추가
    const label = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .text(d => d.name)
      .attr('font-size', '10px')
      .attr('dx', 15)
      .attr('dy', 4);

    // 툴팁 이벤트
    node
      .on('mouseover', (event, d) => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = event.pageX + 'px';
          tooltipRef.current.style.top = event.pageY + 'px';
          tooltipRef.current.innerHTML = `
            <div>${d.name}</div>
            <div>Type: ${d.type}</div>
            ${d.value ? `<div>Value: ${d.value}</div>` : ''}
            ${d.group ? `<div>Group: ${d.group}</div>` : ''}
          `;
        }
      })
      .on('mouseout', () => {
        if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
        }
      });

    // 시뮬레이션 업데이트
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });
  };

  const drag = (simulation: d3.Simulation<Node, Link>) => {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3
      .drag<SVGCircleElement, Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  return (
    <Container ref={containerRef}>
      <svg ref={svgRef} />
      <Tooltip ref={tooltipRef} />
    </Container>
  );
};

export default NodeGraphWidget; 