import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from './AnalyticsService';
export class DistributedAnalyticsService {
    static instance;
    nodes = new Map();
    tasks = new Map();
    taskQueue = new Subject();
    resultStream = new Subject();
    analyticsService;
    constructor() {
        this.analyticsService = AnalyticsService.getInstance();
        this.startTaskProcessor();
    }
    static getInstance() {
        if (!DistributedAnalyticsService.instance) {
            DistributedAnalyticsService.instance = new DistributedAnalyticsService();
        }
        return DistributedAnalyticsService.instance;
    }
    // 분석 노드 등록
    registerNode(node) {
        this.nodes.set(node.id, node);
    }
    // 분석 노드 제거
    removeNode(nodeId) {
        this.nodes.delete(nodeId);
    }
    // 분석 작업 제출
    submitTask(task) {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fullTask = {
            ...task,
            id: taskId,
            status: 'pending'
        };
        this.tasks.set(taskId, fullTask);
        this.taskQueue.next(fullTask);
        return taskId;
    }
    // 작업 상태 조회
    getTaskStatus(taskId) {
        return this.tasks.get(taskId);
    }
    // 작업 결과 구독
    subscribeToResults() {
        return this.resultStream.asObservable();
    }
    // 분산 예측 실행
    async distributedPredict(modelId, data, strategy) {
        const nodes = this.selectNodes(strategy);
        if (nodes.length === 0) {
            throw new Error('No available nodes for prediction');
        }
        // 데이터 분할
        const chunkedData = this.chunkData(data, nodes.length);
        const predictions = [];
        // 각 노드에 작업 분배
        const predictionTasks = nodes.map((node, index) => {
            return this.submitPredictionTask(node, modelId, chunkedData[index]);
        });
        // 결과 수집
        const results = await Promise.all(predictionTasks);
        results.forEach(result => {
            if (result.predictions) {
                predictions.push(...result.predictions);
            }
        });
        return predictions;
    }
    // 분산 모델 훈련
    async distributedTraining(modelConfig, data, strategy) {
        const nodes = this.selectNodes(strategy);
        if (nodes.length === 0) {
            throw new Error('No available nodes for training');
        }
        // 데이터 분할
        const chunkedData = this.chunkData(data, nodes.length);
        // 각 노드에서 부분 훈련 실행
        const trainingTasks = nodes.map((node, index) => {
            return this.submitTrainingTask(node, modelConfig, chunkedData[index]);
        });
        // 모든 부분 훈련 완료 대기
        await Promise.all(trainingTasks);
        // 모델 병합
        await this.mergeModels(modelConfig.id, nodes);
    }
    // 노드 선택
    selectNodes(strategy) {
        const availableNodes = Array.from(this.nodes.values())
            .filter(node => node.status === 'active');
        switch (strategy.type) {
            case 'round-robin':
                return availableNodes;
            case 'least-loaded':
                return availableNodes
                    .filter(node => (!strategy.options?.minLoad || node.load >= strategy.options.minLoad) &&
                    (!strategy.options?.maxLoad || node.load <= strategy.options.maxLoad))
                    .sort((a, b) => a.load - b.load);
            case 'capability-based':
                return availableNodes
                    .filter(node => !strategy.options?.requiredCapabilities ||
                    strategy.options.requiredCapabilities.every(cap => node.capabilities.includes(cap)));
            default:
                return availableNodes;
        }
    }
    // 데이터 분할
    chunkData(data, chunks) {
        const chunkSize = Math.ceil(data.length / chunks);
        return Array.from({ length: chunks }, (_, i) => data.slice(i * chunkSize, (i + 1) * chunkSize));
    }
    // 예측 작업 제출
    async submitPredictionTask(node, modelId, data) {
        const taskId = this.submitTask({
            type: 'prediction',
            modelId,
            data,
            priority: 1
        });
        return new Promise((resolve, reject) => {
            this.subscribeToResults()
                .pipe(filter(result => result.taskId === taskId))
                .subscribe({
                next: result => resolve(result),
                error: error => reject(error)
            });
        });
    }
    // 훈련 작업 제출
    async submitTrainingTask(node, modelConfig, data) {
        const taskId = this.submitTask({
            type: 'training',
            modelId: modelConfig.id,
            data,
            priority: 2
        });
        return new Promise((resolve, reject) => {
            this.subscribeToResults()
                .pipe(filter(result => result.taskId === taskId))
                .subscribe({
                next: () => resolve(),
                error: error => reject(error)
            });
        });
    }
    // 모델 병합
    async mergeModels(modelId, nodes) {
        // 실제 구현에서는 각 노드의 모델 가중치를 가져와 병합
        console.log(`Merging models for ${modelId} from ${nodes.length} nodes`);
    }
    // 작업 처리기 시작
    startTaskProcessor() {
        this.taskQueue.subscribe(async (task) => {
            try {
                const node = this.selectNodes({
                    type: 'least-loaded',
                    options: { maxLoad: 0.8 }
                })[0];
                if (!node) {
                    throw new Error('No available nodes');
                }
                // 작업 상태 업데이트
                task.status = 'running';
                this.tasks.set(task.id, task);
                // 작업 실행
                const result = await this.executeTask(node, task);
                // 결과 처리
                task.status = 'completed';
                task.result = result;
                this.tasks.set(task.id, task);
                this.resultStream.next({ taskId: task.id, ...result });
            }
            catch (error) {
                task.status = 'failed';
                task.error = error instanceof Error ? error.message : 'Unknown error';
                this.tasks.set(task.id, task);
            }
        });
    }
    // 작업 실행
    async executeTask(node, task) {
        try {
            const response = await fetch(`${node.url}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });
            if (!response.ok) {
                throw new Error(`Task execution failed: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error(`Failed to execute task on node ${node.id}:`, error);
            throw error;
        }
    }
    // 리소스 정리
    dispose() {
        this.taskQueue.complete();
        this.resultStream.complete();
    }
}
