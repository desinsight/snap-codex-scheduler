import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleForm from './ScheduleForm';
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

describe('ScheduleForm', () => {
  const renderComponent = (initialState = {}, initialEntries = ['/schedules/new']) => {
    const store = mockStore({
      schedules: {
        selectedSchedule: null,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path="/schedules/new" element={<ScheduleForm />} />
              <Route path="/schedules/:id/edit" element={<ScheduleForm />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders create form', () => {
    renderComponent();

    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
    expect(screen.getByLabelText('End Time')).toBeInTheDocument();
    expect(screen.getByLabelText('All Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Shared')).toBeInTheDocument();
  });

  it('renders edit form with schedule data', () => {
    renderComponent(
      {
        schedules: {
          selectedSchedule: mockSchedule,
          loading: false,
          error: null,
        },
      },
      ['/schedules/1/edit']
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Schedule')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test schedule')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-20T10:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-20T12:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('WORK')).toBeInTheDocument();
    expect(screen.getByLabelText('Shared')).toBeChecked();
  });

  it('handles form submission for create', async () => {
    const store = mockStore({
      schedules: {
        selectedSchedule: null,
        loading: false,
        error: null,
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Schedule' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New description' },
    });

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('schedules/createSchedule/pending');
    });
  });

  it('handles form submission for edit', async () => {
    const store = mockStore({
      schedules: {
        selectedSchedule: mockSchedule,
        loading: false,
        error: null,
      },
    });

    renderComponent(
      {
        schedules: {
          selectedSchedule: mockSchedule,
          loading: false,
          error: null,
        },
      },
      ['/schedules/1/edit']
    );

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Schedule' },
    });

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('schedules/updateSchedule/pending');
    });
  });

  it('shows loading state', () => {
    renderComponent({
      schedules: {
        selectedSchedule: null,
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByText('Saving...')).toBeDisabled();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to save schedule';
    renderComponent({
      schedules: {
        selectedSchedule: null,
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles cancel button click', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Cancel'));
    // Add navigation test if needed
  });
}); 