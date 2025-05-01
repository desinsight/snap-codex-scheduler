import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ServiceConfig,
  ServiceHealth,
  ServiceMetrics,
  ServiceDiscovery,
  CircuitBreakerConfig,
  LoadBalancerConfig,
  ServiceCommunication,
  ServiceMonitoring,
} from '../../types/microservice';

interface MicroserviceState {
  services: {
    [name: string]: ServiceConfig;
  };
  health: {
    [name: string]: ServiceHealth;
  };
  metrics: {
    [name: string]: ServiceMetrics;
  };
  discovery: ServiceDiscovery;
  circuitBreakers: {
    [name: string]: CircuitBreakerConfig;
  };
  loadBalancers: {
    [name: string]: LoadBalancerConfig;
  };
  communication: ServiceCommunication;
  monitoring: ServiceMonitoring;
  loading: boolean;
  error: string | null;
}

const initialState: MicroserviceState = {
  services: {},
  health: {},
  metrics: {},
  discovery: { services: {} },
  circuitBreakers: {},
  loadBalancers: {},
  communication: {
    protocol: 'http',
    timeout: 5000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  monitoring: {
    metrics: {
      collectionInterval: 5000,
      retentionPeriod: 86400000,
    },
    logging: {
      level: 'info',
      format: 'json',
    },
    tracing: {
      enabled: true,
      samplingRate: 0.1,
    },
  },
  loading: false,
  error: null,
};

export const fetchServiceConfigs = createAsyncThunk(
  'microservice/fetchServiceConfigs',
  async () => {
    const response = await fetch('/api/microservices/configs');
    if (!response.ok) {
      throw new Error('Failed to fetch service configs');
    }
    return response.json();
  }
);

export const updateServiceConfig = createAsyncThunk(
  'microservice/updateServiceConfig',
  async ({ name, config }: { name: string; config: ServiceConfig }) => {
    const response = await fetch(`/api/microservices/configs/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      throw new Error('Failed to update service config');
    }
    return response.json();
  }
);

export const fetchServiceHealth = createAsyncThunk(
  'microservice/fetchServiceHealth',
  async (name: string) => {
    const response = await fetch(`/api/microservices/health/${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service health');
    }
    return response.json();
  }
);

export const fetchServiceMetrics = createAsyncThunk(
  'microservice/fetchServiceMetrics',
  async (name: string) => {
    const response = await fetch(`/api/microservices/metrics/${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch service metrics');
    }
    return response.json();
  }
);

export const updateCircuitBreaker = createAsyncThunk(
  'microservice/updateCircuitBreaker',
  async ({ name, config }: { name: string; config: CircuitBreakerConfig }) => {
    const response = await fetch(`/api/microservices/circuit-breakers/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      throw new Error('Failed to update circuit breaker');
    }
    return response.json();
  }
);

const microserviceSlice = createSlice({
  name: 'microservice',
  initialState,
  reducers: {
    setCommunicationConfig: (state, action) => {
      state.communication = action.payload;
    },
    setMonitoringConfig: (state, action) => {
      state.monitoring = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchServiceConfigs.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServiceConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch service configs';
      })
      .addCase(updateServiceConfig.fulfilled, (state, action) => {
        const { name, config } = action.payload;
        state.services[name] = config;
      })
      .addCase(fetchServiceHealth.fulfilled, (state, action) => {
        const { name, health } = action.payload;
        state.health[name] = health;
      })
      .addCase(fetchServiceMetrics.fulfilled, (state, action) => {
        const { name, metrics } = action.payload;
        state.metrics[name] = metrics;
      })
      .addCase(updateCircuitBreaker.fulfilled, (state, action) => {
        const { name, config } = action.payload;
        state.circuitBreakers[name] = config;
      });
  },
});

export const { setCommunicationConfig, setMonitoringConfig } = microserviceSlice.actions;
export default microserviceSlice.reducer;
