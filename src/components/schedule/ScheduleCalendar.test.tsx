import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleCalendar from './ScheduleCalendar';
import { Schedule } from '../../types/schedule';

const mockStore = configureStore([thunk]);

describe('ScheduleCalendar', () => {
  const mockSchedules: Schedule[] = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team meeting',
      startDate: new Date('2024-03-20T10:00:00'),
      endDate: new Date('2024-03-20T12:00:00'),
      isAllDay: false,
      category: 'work',
      isShared: true,
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Doctor Appointment',
      description: 'Annual checkup',
      startDate: new Date('2024-03-21T14:00:00'),
      endDate: new Date('2024-03-21T15:00:00'),
      isAllDay: false,
      category: 'health',
      isShared: false,
      createdBy: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const renderComponent = (initialState = {}) => {
    const store = mockStore({
      schedules: {
        schedules: mockSchedules,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ScheduleCalendar />
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders calendar with view buttons', () => {
    renderComponent();

    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
  });

  it('changes view when view button is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Week'));
    expect(screen.getByText('Week')).toHaveStyle({
      backgroundColor: expect.any(String),
    });

    fireEvent.click(screen.getByText('Day'));
    expect(screen.getByText('Day')).toHaveStyle({
      backgroundColor: expect.any(String),
    });
  });

  it('renders schedule events with correct colors', () => {
    renderComponent();

    const workEvent = screen.getByText('Team Meeting');
    const healthEvent = screen.getByText('Doctor Appointment');

    expect(workEvent).toHaveStyle({
      backgroundColor: '#4f46e5',
    });

    expect(healthEvent).toHaveStyle({
      backgroundColor: '#ef4444',
    });
  });

  it('shows loading state', () => {
    renderComponent({
      schedules: {
        schedules: [],
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('Loading schedules...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to fetch schedules';
    renderComponent({
      schedules: {
        schedules: [],
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('opens form when event is clicked', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Team Meeting'));
    expect(screen.getByText('Edit Schedule')).toBeInTheDocument();
  });

  it('opens form when time slot is clicked', () => {
    renderComponent();

    const calendar = screen.getByTestId('calendar');
    fireEvent.click(calendar);
    expect(screen.getByText('Create Schedule')).toBeInTheDocument();
  });
}); 