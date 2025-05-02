import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { NodeGraphService } from '../../services/NodeGraphService';
import * as d3 from 'd3';
export const NodeGraphWidget = ({ timeRange = '24h', layout = 'force' }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    useEffect(() => {
        loadNodeGraphData();
    }, [timeRange]);
    useEffect(() => {
        if (data && containerRef.current && svgRef.current) {
            renderGraph();
        }
    }, [data, layout]);
    const loadNodeGraphData = async () => {
        try {
            setLoading(true);
            const nodeGraphService = NodeGraphService.getInstance();
            const graphData = await nodeGraphService.getNodeGraphData(timeRange);
            setData(graphData);
            setLoading(false);
        }
        catch (err) {
            setError('노드 그래프 데이터를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };
    const renderGraph = () => {
        if (!data || !containerRef.current || !svgRef.current)
            return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        // SVG 초기화
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', width).attr('height', height);
        // 시뮬레이션 설정
        const simulation = d3
            .forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id((d) => d.id))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));
        // 링크 그리기
        const link = svg
            .append('g')
            .selectAll('line')
            .data(data.links)
            .enter()
            .append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value));
        // 노드 그룹 생성
        const node = svg
            .append('g')
            .selectAll('g')
            .data(data.nodes)
            .enter()
            .append('g')
            .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
        // 노드 원형 추가
        node
            .append('circle')
            .attr('r', 10)
            .attr('fill', d => getNodeColor(d.type))
            .on('click', (event, d) => setSelectedNode(d.id));
        // 노드 레이블 추가
        node
            .append('text')
            .text(d => d.id)
            .attr('x', 15)
            .attr('y', 3)
            .style('font-size', '12px');
        // 시뮬레이션 업데이트
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
        // 드래그 이벤트 핸들러
        function dragstarted(event, d) {
            if (!event.active)
                simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };
    const getNodeColor = (type) => {
        switch (type) {
            case 'service':
                return '#4d94ff';
            case 'database':
                return '#ff4d4d';
            case 'cache':
                return '#40c463';
            default:
                return '#999';
        }
    };
    if (loading) {
        return _jsx("div", { className: "node-graph-widget loading", children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { className: "node-graph-widget error", children: error });
    }
    return (_jsxs("div", { className: "node-graph-widget", children: [_jsxs("div", { className: "header", children: [_jsx("h3", { children: "\uB178\uB4DC \uADF8\uB798\uD504" }), _jsx("div", { className: "controls", children: _jsxs("select", { value: layout, onChange: e => setLayout(e.target.value), children: [_jsx("option", { value: "force", children: "Force Layout" }), _jsx("option", { value: "hierarchical", children: "Hierarchical Layout" })] }) })] }), _jsx("div", { className: "graph-container", ref: containerRef, children: _jsx("svg", { ref: svgRef }) }), selectedNode && (_jsxs("div", { className: "node-details", children: [_jsx("h4", { children: "\uB178\uB4DC \uC0C1\uC138 \uC815\uBCF4" }), _jsxs("div", { className: "details-content", children: [_jsxs("p", { children: ["ID: ", selectedNode] }), _jsxs("p", { children: ["\uD0C0\uC785: ", data?.nodes.find(n => n.id === selectedNode)?.type] }), _jsxs("p", { children: ["\uC5F0\uACB0 \uC218: ", data?.links.filter(l => l.source.id === selectedNode || l.target.id === selectedNode).length] })] })] })), _jsx("style", { jsx: true, children: `
        .node-graph-widget {
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

        .graph-container {
          width: 100%;
          height: 500px;
          border: 1px solid #eee;
          border-radius: 4px;
          overflow: hidden;
        }

        .node-details {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .details-content {
          margin-top: 10px;
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
