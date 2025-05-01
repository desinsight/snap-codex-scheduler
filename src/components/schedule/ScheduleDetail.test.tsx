import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleDetail from './ScheduleDetail';
import { Schedule, ScheduleCategory } from '../../types/schedule';

const mockStore = configureStore([thunk]);

const mockSchedule: Schedule = {
  id: '1',
  title: 'Test Schedule',
  description: 'This is a test schedule',
  startDate: new Date('2024-03-20T10:00:00'),
  endDate: new Date('2024-03-20T12:00:00'),
  isAllDay: false,
  category: ScheduleCategory.WORK,
  isShared: true,
  createdBy: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ScheduleDetail', () => {
  const renderComponent = (initialState = {}) => {
    const store = mockStore({
      schedules: {
        selectedSchedule: mockSchedule,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/schedules/1']}>
            <Routes>
              <Route path="/schedules/:id" element={<ScheduleDetail />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders schedule details', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Schedule')).toBeInTheDocument();
      expect(screen.getByText('This is a test schedule')).toBeInTheDocument();
      expect(screen.getByText('Work')).toBeInTheDocument();
      expect(screen.getByText(/Mar 20, 2024/)).toBeInTheDocument();
    });
  });

  it('shows loading spinner while loading', () => {
    renderComponent({
      schedules: {
        selectedSchedule: null,
        loading: true,
        error: null,
      },
    });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    const errorMessage = 'Failed to fetch schedule';
    renderComponent({
      schedules: {
        selectedSchedule: null,
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows not found message when schedule is not found', () => {
    renderComponent({
      schedules: {
        selectedSchedule: null,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText('Schedule not found')).toBeInTheDocument();
  });

  it('displays all-day text for all-day events', () => {
    const allDaySchedule = {
      ...mockSchedule,
      isAllDay: true,
    };

    renderComponent({
      schedules: {
        selectedSchedule: allDaySchedule,
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText('All Day')).toBeInTheDocument();
  });

  it('displays edit and delete buttons', () => {
    renderComponent();

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('displays back button', () => {
    renderComponent();

    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
