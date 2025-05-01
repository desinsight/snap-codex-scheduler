import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleCalendar from './ScheduleCalendar';
import { Schedule } from '../../types/schedule';

const mockStore = configureStore([thunk]);

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
  {
    id: '3',
    title: 'Online Course',
    description: 'React Advanced Course',
    startDate: new Date('2024-03-22T09:00:00'),
    endDate: new Date('2024-03-22T11:00:00'),
    isAllDay: false,
    category: 'education',
    isShared: true,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Gym',
    description: 'Workout session',
    startDate: new Date('2024-03-23T18:00:00'),
    endDate: new Date('2024-03-23T19:00:00'),
    isAllDay: false,
    category: 'health',
    isShared: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default {
  title: 'Components/Schedule/ScheduleCalendar',
  component: ScheduleCalendar,
  decorators: [
    Story => (
      <Provider store={mockStore({})}>
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      </Provider>
    ),
  ],
} as Meta;

const Template: Story = () => {
  const store = mockStore({
    schedules: {
      schedules: mockSchedules,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleCalendar />
    </Provider>
  );
};

export const Default = Template.bind({});

export const MonthView = () => {
  const store = mockStore({
    schedules: {
      schedules: mockSchedules,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleCalendar />
    </Provider>
  );
};

export const WeekView = () => {
  const store = mockStore({
    schedules: {
      schedules: mockSchedules,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleCalendar />
    </Provider>
  );
};

export const DayView = () => {
  const store = mockStore({
    schedules: {
      schedules: mockSchedules,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleCalendar />
    </Provider>
  );
};

export const Loading = () => {
  const store = mockStore({
    schedules: {
      schedules: [],
      loading: true,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleCalendar />
    </Provider>
  );
};

export const Error = () => {
  const store = mockStore({
    schedules: {
      schedules: [],
      loading: false,
      error: 'Failed to fetch schedules',
    },
  });

  return (
    <Provider store={store}>
      <ScheduleCalendar />
    </Provider>
  );
};
