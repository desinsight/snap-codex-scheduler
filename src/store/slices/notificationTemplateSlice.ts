import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationTemplate, NotificationTemplateState, TemplateImportExport } from '../../types/notification';

const initialState: NotificationTemplateState = {
  templates: [],
  loading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk(
  'notificationTemplates/fetchTemplates',
  async () => {
    const response = await fetch('/api/notification-templates');
    if (!response.ok) {
      throw new Error('Failed to fetch templates');
    }
    return response.json();
  }
);

export const createTemplate = createAsyncThunk(
  'notificationTemplates/createTemplate',
  async (template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'usage'>) => {
    const response = await fetch('/api/notification-templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Failed to create template');
    }
    return response.json();
  }
);

export const updateTemplate = createAsyncThunk(
  'notificationTemplates/updateTemplate',
  async (template: NotificationTemplate) => {
    const response = await fetch(`/api/notification-templates/${template.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });
    if (!response.ok) {
      throw new Error('Failed to update template');
    }
    return response.json();
  }
);

export const deleteTemplate = createAsyncThunk(
  'notificationTemplates/deleteTemplate',
  async (templateId: string) => {
    const response = await fetch(`/api/notification-templates/${templateId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
    return templateId;
  }
);

export const cloneTemplate = createAsyncThunk(
  'notificationTemplates/cloneTemplate',
  async (templateId: string) => {
    const response = await fetch(`/api/notification-templates/${templateId}/clone`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to clone template');
    }
    return response.json();
  }
);

export const importTemplates = createAsyncThunk(
  'notificationTemplates/importTemplates',
  async (data: TemplateImportExport) => {
    const response = await fetch('/api/notification-templates/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to import templates');
    }
    return response.json();
  }
);

export const exportTemplates = createAsyncThunk(
  'notificationTemplates/exportTemplates',
  async () => {
    const response = await fetch('/api/notification-templates/export');
    if (!response.ok) {
      throw new Error('Failed to export templates');
    }
    const data = await response.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `templates-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return data;
  }
);

export const rollbackTemplate = createAsyncThunk(
  'notificationTemplates/rollbackTemplate',
  async ({ templateId, versionId }: { templateId: string; versionId: string }) => {
    const response = await fetch(`/api/notification-templates/${templateId}/rollback/${versionId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to rollback template');
    }
    return response.json();
  }
);

const notificationTemplateSlice = createSlice({
  name: 'notificationTemplates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create template';
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update template';
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete template';
      })
      .addCase(cloneTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cloneTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(cloneTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clone template';
      })
      .addCase(importTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(importTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to import templates';
      })
      .addCase(exportTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportTemplates.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export templates';
      })
      .addCase(rollbackTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rollbackTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(rollbackTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to rollback template';
      });
  },
});

export default notificationTemplateSlice.reducer; 