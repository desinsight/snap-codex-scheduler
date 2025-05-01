import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleShare from './ScheduleShare';

const mockStore = configureStore([thunk]);

describe('ScheduleShare', () => {
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
          <MemoryRouter initialEntries={['/schedules/1/share']}>
            <Routes>
              <Route path="/schedules/:id/share" element={<ScheduleShare />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders share form', () => {
    renderComponent();

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('schedules/shareSchedule/pending');
    });
  });

  it('shows loading state', () => {
    renderComponent({
      schedules: {
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('Sharing...')).toBeInTheDocument();
    expect(screen.getByText('Sharing...')).toBeDisabled();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to share schedule';
    renderComponent({
      schedules: {
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows success message after successful share', async () => {
    const store = mockStore({
      schedules: {
        loading: false,
        error: null,
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.click(screen.getByText('Share'));

    await waitFor(() => {
      expect(screen.getByText('Schedule shared successfully')).toBeInTheDocument();
    });
  });

  it('handles cancel button click', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancel'));
    // Add navigation test if needed
  });
});
