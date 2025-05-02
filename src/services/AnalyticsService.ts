import { Subject, Observable } from 'rxjs';
import { map, filter, bufferTime } from 'rxjs/operators';
import * as tf from '@tensorflow/tfjs';

export interface ModelConfig {
  id: string;
  type: 'prediction' | 'anomaly' | 'classification';
  modelUrl?: string;
  inputShape: number[];
  outputShape: number[];
  preprocessor?: (data: any) => number[];
  postprocessor?: (prediction: any) => any;
  threshold?: number; // 이상 감지를 위한 임계값
}

export interface PredictionResult {
  timestamp: number;
  input: any;
  prediction: any;
  confidence?: number;
  anomaly?: boolean;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private models: Map<string, tf.LayersModel> = new Map();
  private modelConfigs: Map<string, ModelConfig> = new Map();
  private predictionStream: Subject<PredictionResult> = new Subject();
  private anomalyStream: Subject<PredictionResult> = new Subject();

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // 모델 로드 및 등록
  async registerModel(config: ModelConfig): Promise<void> {
    try {
      let model: tf.LayersModel;

      if (config.modelUrl) {
        // 사전 훈련된 모델 로드
        model = await tf.loadLayersModel(config.modelUrl);
      } else {
        // 기본 모델 생성 (예: 이상 감지를 위한 오토인코더)
        model = this.createDefaultModel(config);
      }

      this.models.set(config.id, model);
      this.modelConfigs.set(config.id, config);
    } catch (error) {
      console.error('Failed to load model:', error);
      throw error;
    }
  }

  // 예측 실행
  async predict(modelId: string, data: any): Promise<PredictionResult> {
    const model = this.models.get(modelId);
    const config = this.modelConfigs.get(modelId);

    if (!model || !config) {
      throw new Error('Model not found');
    }

    try {
      // 데이터 전처리
      const input = config.preprocessor ? config.preprocessor(data) : data;
      const inputTensor = tf.tensor(input).reshape(config.inputShape);

      // 예측 실행
      const predictionTensor = model.predict(inputTensor) as tf.Tensor;
      const prediction = await predictionTensor.array();

      // 후처리 및 결과 생성
      const result: PredictionResult = {
        timestamp: Date.now(),
        input: data,
        prediction: config.postprocessor ? config.postprocessor(prediction) : prediction
      };

      // 신뢰도 계산 (해당하는 경우)
      if (config.type === 'classification') {
        result.confidence = this.calculateConfidence(prediction);
      }

      // 이상 감지 (해당하는 경우)
      if (config.type === 'anomaly') {
        const reconstructionError = this.calculateReconstructionError(input, prediction);
        result.anomaly = reconstructionError > (config.threshold || 0.5);
      }

      // 결과 스트리밍
      this.predictionStream.next(result);
      if (result.anomaly) {
        this.anomalyStream.next(result);
      }

      return result;
    } catch (error) {
      console.error('Prediction failed:', error);
      throw error;
    }
  }

  // 실시간 예측 스트림 구독
  subscribeToPredictions(modelId: string): Observable<PredictionResult> {
    return this.predictionStream.pipe(
      filter(result => result.input.modelId === modelId)
    );
  }

  // 실시간 이상 감지 스트림 구독
  subscribeToAnomalies(modelId: string): Observable<PredictionResult> {
    return this.anomalyStream.pipe(
      filter(result => result.input.modelId === modelId)
    );
  }

  // 모델 업데이트 (온라인 학습)
  async updateModel(modelId: string, newData: any[]): Promise<void> {
    const model = this.models.get(modelId);
    const config = this.modelConfigs.get(modelId);

    if (!model || !config) {
      throw new Error('Model not found');
    }

    try {
      // 데이터 전처리
      const processedData = newData.map(d => config.preprocessor ? config.preprocessor(d) : d);
      const inputTensor = tf.tensor(processedData).reshape([newData.length, ...config.inputShape.slice(1)]);

      // 모델 업데이트
      await model.fit(inputTensor, inputTensor, {
        epochs: 1,
        batchSize: 32
      });

      console.log('Model updated successfully');
    } catch (error) {
      console.error('Model update failed:', error);
      throw error;
    }
  }

  // 기본 모델 생성 (예: 이상 감지를 위한 오토인코더)
  private createDefaultModel(config: ModelConfig): tf.LayersModel {
    const model = tf.sequential();

    // 인코더
    model.add(tf.layers.dense({
      inputShape: [config.inputShape[1]],
      units: Math.floor(config.inputShape[1] / 2),
      activation: 'relu'
    }));

    // 디코더
    model.add(tf.layers.dense({
      units: config.inputShape[1],
      activation: 'sigmoid'
    }));

    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });

    return model;
  }

  // 분류 모델의 신뢰도 계산
  private calculateConfidence(prediction: number[][]): number {
    return Math.max(...prediction[0]);
  }

  // 재구성 오차 계산 (이상 감지용)
  private calculateReconstructionError(input: number[], prediction: number[][]): number {
    return input.reduce((error, value, index) => {
      return error + Math.pow(value - prediction[0][index], 2);
    }, 0) / input.length;
  }

  // 모델 제거
  removeModel(modelId: string) {
    const model = this.models.get(modelId);
    if (model) {
      model.dispose();
      this.models.delete(modelId);
      this.modelConfigs.delete(modelId);
    }
  }

  // 모든 모델 제거
  dispose() {
    this.models.forEach(model => model.dispose());
    this.models.clear();
    this.modelConfigs.clear();
  }
} 