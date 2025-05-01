import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleDetail from './ScheduleDetail';
import { Schedule, ScheduleCategory } from '../../types/schedule';

const mockStore = configureStore([thunk]);

export default {
  title: 'Components/Schedule/ScheduleDetail',
  component: ScheduleDetail,
  decorators: [
    (Story) => (
      <Provider store={mockStore({})}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/schedules/1']}>
            <Routes>
              <Route path="/schedules/:id" element={<Story />} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    ),
  ],
} as Meta;

const Template: Story<{ schedule: Schedule }> = (args) => {
  const store = mockStore({
    schedules: {
      selectedSchedule: args.schedule,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleDetail />
    </Provider>
  );
};

export const Default = Template.bind({});
Default.args = {
  schedule: {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync meeting to discuss project progress and upcoming tasks.',
    startDate: new Date('2024-03-20T10:00:00'),
    endDate: new Date('2024-03-20T11:00:00'),
    isAllDay: false,
    category: ScheduleCategory.WORK,
    isShared: true,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const AllDayEvent = Template.bind({});
AllDayEvent.args = {
  schedule: {
    id: '2',
    title: 'Company Holiday',
    description: 'Company-wide holiday for team building and relaxation.',
    startDate: new Date('2024-03-21T00:00:00'),
    endDate: new Date('2024-03-21T23:59:59'),
    isAllDay: true,
    category: ScheduleCategory.PERSONAL,
    isShared: true,
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const PrivateEvent = Template.bind({});
PrivateEvent.args = {
  schedule: {
    id: '3',
    title: 'Doctor Appointment',
    description: 'Annual health checkup and consultation.',
    startDate: new Date('2024-03-22T14:00:00'),
    endDate: new Date('2024-03-22T15:00:00'),
    isAllDay: false,
    category: ScheduleCategory.HEALTH,
    isShared: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const EducationEvent = Template.bind({});
EducationEvent.args = {
  schedule: {
    id: '4',
    title: 'Online Course',
    description: 'Advanced React patterns and best practices workshop.',
    startDate: new Date('2024-03-23T19:00:00'),
    endDate: new Date('2024-03-23T21:00:00'),
    isAllDay: false,
    category: ScheduleCategory.EDUCATION,
    isShared: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const Loading = () => {
  const store = mockStore({
    schedules: {
      selectedSchedule: null,
      loading: true,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleDetail />
    </Provider>
  );
};

export const Error = () => {
  const store = mockStore({
    schedules: {
      selectedSchedule: null,
      loading: false,
      error: 'Failed to fetch schedule details',
    },
  });

  return (
    <Provider store={store}>
      <ScheduleDetail />
    </Provider>
  );
};

export const NotFound = () => {
  const store = mockStore({
    schedules: {
      selectedSchedule: null,
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleDetail />
    </Provider>
  );
}; 