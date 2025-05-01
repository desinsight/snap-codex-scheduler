import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SecurityState, SecuritySettings, BackupSettings, ErrorHandling } from '../types/notification';

const initialState: SecurityState = {
  settings: {
    encryption: {
      enabled: true,
      algorithm: 'AES-256',
      keyRotationInterval: 30,
      lastRotation: new Date(),
    },
    accessControl: {
      roleBased: true,
      roles: {
        admin: ['*'],
        manager: ['read', 'write'],
        user: ['read'],
      },
      permissions: {
        read: ['notifications', 'preferences'],
        write: ['notifications', 'preferences'],
        delete: ['notifications'],
      },
    },
    auditLog: {
      enabled: true,
      retentionPeriod: 90,
      logLevel: 'info',
    },
  },
  backup: {
    schedule: {
      frequency: 'daily',
      time: '00:00',
      lastBackup: new Date(),
    },
    retention: {
      period: 30,
      maxBackups: 10,
    },
    storage: {
      type: 'cloud',
      location: 's3://backups',
      encryption: true,
    },
  },
  errorHandling: {
    retryPolicy: {
      maxAttempts: 3,
      backoffInterval: 5,
      exponential: true,
    },
    fallbackStrategy: {
      enabled: true,
      alternativeChannels: ['email', 'sms'],
      timeout: 30,
    },
    monitoring: {
      enabled: true,
      alertThreshold: 80,
      notificationChannels: ['email', 'push'],
    },
  },
  loading: false,
  error: null,
};

export const fetchSecuritySettings = createAsyncThunk(
  'security/fetchSettings',
  async () => {
    const response = await fetch('/api/security/settings');
    if (!response.ok) {
      throw new Error('Failed to fetch security settings');
    }
    return response.json();
  }
);

export const updateSecuritySettings = createAsyncThunk(
  'security/updateSettings',
  async (settings: SecuritySettings) => {
    const response = await fetch('/api/security/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update security settings');
    }
    return response.json();
  }
);

export const updateBackupSettings = createAsyncThunk(
  'security/updateBackup',
  async (backup: BackupSettings) => {
    const response = await fetch('/api/security/backup', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backup),
    });
    if (!response.ok) {
      throw new Error('Failed to update backup settings');
    }
    return response.json();
  }
);

export const updateErrorHandling = createAsyncThunk(
  'security/updateErrorHandling',
  async (errorHandling: ErrorHandling) => {
    const response = await fetch('/api/security/error-handling', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorHandling),
    });
    if (!response.ok) {
      throw new Error('Failed to update error handling settings');
    }
    return response.json();
  }
);

export const performBackup = createAsyncThunk(
  'security/performBackup',
  async () => {
    const response = await fetch('/api/security/backup/perform', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to perform backup');
    }
    return response.json();
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecuritySettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecuritySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload.settings;
        state.backup = action.payload.backup;
        state.errorHandling = action.payload.errorHandling;
      })
      .addCase(fetchSecuritySettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch security settings';
      })
      .addCase(updateSecuritySettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateBackupSettings.fulfilled, (state, action) => {
        state.backup = action.payload;
      })
      .addCase(updateErrorHandling.fulfilled, (state, action) => {
        state.errorHandling = action.payload;
      })
      .addCase(performBackup.fulfilled, (state, action) => {
        state.backup.schedule.lastBackup = new Date(action.payload.timestamp);
      });
  },
});

export default securitySlice.reducer; 