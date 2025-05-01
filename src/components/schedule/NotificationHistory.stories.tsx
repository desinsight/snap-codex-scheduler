import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import NotificationHistory from './NotificationHistory';
import { NotificationHistory as NotificationHistoryType } from '../../types/notification';

const mockStore = configureStore([thunk]);

export default {
  title: 'Components/Schedule/NotificationHistory',
  component: NotificationHistory,
  decorators: [
    (Story) => (
      <Provider store={mockStore({})}>
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      </Provider>
    ),
  ],
} as Meta;

const Template: Story = (args) => <NotificationHistory {...args} />;

const mockHistory: NotificationHistoryType[] = [
  {
    id: '1',
    scheduleId: 'schedule-1',
    type: 'email',
    sentAt: new Date('2024-03-20T10:00:00'),
    status: 'success',
  },
  {
    id: '2',
    scheduleId: 'schedule-1',
    type: 'browser',
    sentAt: new Date('2024-03-20T11:00:00'),
    status: 'failed',
    error: 'Failed to send notification',
  },
];

export const Default = Template.bind({});
Default.args = {
  scheduleId: 'schedule-1',
};
Default.decorators = [
  (Story) => (
    <Provider
      store={mockStore({
        notifications: {
          history: mockHistory,
          loading: false,
          error: null,
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const Empty = Template.bind({});
Empty.args = {
  scheduleId: 'schedule-1',
};
Empty.decorators = [
  (Story) => (
    <Provider
      store={mockStore({
        notifications: {
          history: [],
          loading: false,
          error: null,
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const Loading = Template.bind({});
Loading.args = {
  scheduleId: 'schedule-1',
};
Loading.decorators = [
  (Story) => (
    <Provider
      store={mockStore({
        notifications: {
          history: [],
          loading: true,
          error: null,
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const Error = Template.bind({});
Error.args = {
  scheduleId: 'schedule-1',
};
Error.decorators = [
  (Story) => (
    <Provider
      store={mockStore({
        notifications: {
          history: [],
          loading: false,
          error: 'Failed to fetch notification history',
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const ManyItems = Template.bind({});
ManyItems.args = {
  scheduleId: 'schedule-1',
};
ManyItems.decorators = [
  (Story) => (
    <Provider
      store={mockStore({
        notifications: {
          history: [
            ...mockHistory,
            {
              id: '3',
              scheduleId: 'schedule-1',
              type: 'email',
              sentAt: new Date('2024-03-20T12:00:00'),
              status: 'success',
            },
            {
              id: '4',
              scheduleId: 'schedule-1',
              type: 'browser',
              sentAt: new Date('2024-03-20T13:00:00'),
              status: 'success',
            },
            {
              id: '5',
              scheduleId: 'schedule-1',
              type: 'email',
              sentAt: new Date('2024-03-20T14:00:00'),
              status: 'failed',
              error: 'Network error',
            },
          ],
          loading: false,
          error: null,
        },
      })}
    >
      <Story />
    </Provider>
  ),
]; 