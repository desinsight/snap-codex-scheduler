import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ExternalServiceConfig,
  WebhookConfig,
  IntegrationState,
  IntegrationResponse,
} from '../../types/integration';

const initialState: IntegrationState = {
  services: [],
  webhooks: [],
  loading: false,
  error: null,
};

export const fetchIntegrations = createAsyncThunk('integration/fetchIntegrations', async () => {
  const response = await fetch('/api/integrations');
  if (!response.ok) {
    throw new Error('Failed to fetch integrations');
  }
  return response.json();
});

export const addService = createAsyncThunk(
  'integration/addService',
  async (service: ExternalServiceConfig) => {
    const response = await fetch('/api/integrations/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service),
    });
    if (!response.ok) {
      throw new Error('Failed to add service');
    }
    return response.json();
  }
);

export const updateService = createAsyncThunk(
  'integration/updateService',
  async ({ id, service }: { id: string; service: Partial<ExternalServiceConfig> }) => {
    const response = await fetch(`/api/integrations/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(service),
    });
    if (!response.ok) {
      throw new Error('Failed to update service');
    }
    return response.json();
  }
);

export const addWebhook = createAsyncThunk(
  'integration/addWebhook',
  async (webhook: WebhookConfig) => {
    const response = await fetch('/api/integrations/webhooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhook),
    });
    if (!response.ok) {
      throw new Error('Failed to add webhook');
    }
    return response.json();
  }
);

const integrationSlice = createSlice({
  name: 'integration',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch Integrations
      .addCase(fetchIntegrations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload.services;
        state.webhooks = action.payload.webhooks;
      })
      .addCase(fetchIntegrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch integrations';
      })
      // Add Service
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      // Update Service
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(s => s.name === action.payload.name);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      // Add Webhook
      .addCase(addWebhook.fulfilled, (state, action) => {
        state.webhooks.push(action.payload);
      });
  },
});

export default integrationSlice.reducer;
