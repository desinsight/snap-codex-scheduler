import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleImportExport from './ScheduleImportExport';

const mockStore = configureStore([thunk]);

describe('ScheduleImportExport', () => {
  const renderComponent = (initialState = {}) => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ScheduleImportExport />
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders export and import buttons', () => {
    renderComponent();

    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  it('handles export button click', async () => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
    });

    renderComponent();

    fireEvent.click(screen.getByText('Export'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('schedules/exportSchedules/pending');
    });
  });

  it('handles import file selection', async () => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
    });

    renderComponent();

    const file = new File(['test'], 'test.json', { type: 'application/json' });
    const input = screen.getByTestId('file-input');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('schedules/importSchedules/pending');
    });
  });

  it('shows loading state', () => {
    renderComponent({
      schedules: {
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(screen.getByText('Importing...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to export/import schedules';
    renderComponent({
      schedules: {
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows success message after successful export', async () => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
    });

    renderComponent();

    fireEvent.click(screen.getByText('Export'));

    await waitFor(() => {
      expect(screen.getByText('Schedules exported successfully')).toBeInTheDocument();
    });
  });

  it('shows success message after successful import', async () => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
    });

    renderComponent();

    const file = new File(['test'], 'test.json', { type: 'application/json' });
    const input = screen.getByTestId('file-input');
    
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Schedules imported successfully')).toBeInTheDocument();
    });
  });
}); 