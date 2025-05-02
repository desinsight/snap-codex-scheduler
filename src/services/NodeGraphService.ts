import { NodeGraphData } from '../types/nodeGraph';

export class NodeGraphService {
  private static instance: NodeGraphService;
  private data: NodeGraphData = { nodes: [], links: [] };

  private constructor() {
    // 초기 노드 그래프 데이터 로드
    this.loadInitialData();
  }

  public static getInstance(): NodeGraphService {
    if (!NodeGraphService.instance) {
      NodeGraphService.instance = new NodeGraphService();
    }
    return NodeGraphService.instance;
  }

  private async loadInitialData(): Promise<void> {
    try {
      // 실제 구현에서는 API에서 데이터를 가져와야 합니다
      const response = await fetch('/api/node-graph');
      this.data = await response.json();
    } catch (error) {
      console.error('Failed to load initial node graph data:', error);
    }
  }

  public async getNodeGraphData(timeRange: '24h' | '7d' | '30d'): Promise<NodeGraphData> {
    try {
      // 시간 범위에 따른 필터링
      const now = new Date();
      const filteredNodes = this.data.nodes.filter(node => {
        const nodeDate = new Date(node.timestamp);
        const timeDiff = now.getTime() - nodeDate.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        switch (timeRange) {
          case '24h':
            return hoursDiff <= 24;
          case '7d':
            return hoursDiff <= 24 * 7;
          case '30d':
            return hoursDiff <= 24 * 30;
          default:
            return true;
        }
      });

      // 필터링된 노드에 연결된 링크만 포함
      const nodeIds = new Set(filteredNodes.map(node => node.id));
      const filteredLinks = this.data.links.filter(link => 
        nodeIds.has(link.source.id) && nodeIds.has(link.target.id)
      );

      return {
        nodes: filteredNodes,
        links: filteredLinks
      };
    } catch (error) {
      console.error('Failed to get node graph data:', error);
      throw error;
    }
  }

  public async addNode(node: Omit<NodeGraphData['nodes'][0], 'id' | 'timestamp'>): Promise<NodeGraphData['nodes'][0]> {
    try {
      const newNode = {
        ...node,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      this.data.nodes.push(newNode);
      return newNode;
    } catch (error) {
      console.error('Failed to add node:', error);
      throw error;
    }
  }

  public async addLink(link: Omit<NodeGraphData['links'][0], 'id' | 'timestamp'>): Promise<NodeGraphData['links'][0]> {
    try {
      const newLink = {
        ...link,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };

      this.data.links.push(newLink);
      return newLink;
    } catch (error) {
      console.error('Failed to add link:', error);
      throw error;
    }
  }

  public async updateNode(id: string, updates: Partial<NodeGraphData['nodes'][0]>): Promise<NodeGraphData['nodes'][0]> {
    try {
      const index = this.data.nodes.findIndex(node => node.id === id);
      if (index === -1) {
        throw new Error('Node not found');
      }

      this.data.nodes[index] = {
        ...this.data.nodes[index],
        ...updates
      };

      return this.data.nodes[index];
    } catch (error) {
      console.error('Failed to update node:', error);
      throw error;
    }
  }

  public async deleteNode(id: string): Promise<void> {
    try {
      // 노드 삭제
      this.data.nodes = this.data.nodes.filter(node => node.id !== id);
      
      // 관련 링크도 삭제
      this.data.links = this.data.links.filter(
        link => link.source.id !== id && link.target.id !== id
      );
    } catch (error) {
      console.error('Failed to delete node:', error);
      throw error;
    }
  }
} 