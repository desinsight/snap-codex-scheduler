import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import NotificationSettings from './NotificationSettings';
import { NotificationSettings as NotificationSettingsType } from '../../types/notification';

const mockStore = configureStore([thunk]);

export default {
  title: 'Components/Schedule/NotificationSettings',
  component: NotificationSettings,
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

const Template: Story = args => <NotificationSettings {...args} />;

const mockSettings: NotificationSettingsType[] = [
  {
    id: '1',
    scheduleId: 'schedule-1',
    type: 'email',
    time: '10',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    scheduleId: 'schedule-1',
    type: 'browser',
    time: '30',
    enabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const Default = Template.bind({});
Default.args = {
  scheduleId: 'schedule-1',
};
Default.decorators = [
  Story => (
    <Provider
      store={mockStore({
        notifications: {
          settings: mockSettings,
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
  Story => (
    <Provider
      store={mockStore({
        notifications: {
          settings: [],
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
  Story => (
    <Provider
      store={mockStore({
        notifications: {
          settings: [],
          loading: false,
          error: 'Failed to fetch notification settings',
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const AllEnabled = Template.bind({});
AllEnabled.args = {
  scheduleId: 'schedule-1',
};
AllEnabled.decorators = [
  Story => (
    <Provider
      store={mockStore({
        notifications: {
          settings: mockSettings.map(setting => ({
            ...setting,
            enabled: true,
          })),
          loading: false,
          error: null,
        },
      })}
    >
      <Story />
    </Provider>
  ),
];

export const AllDisabled = Template.bind({});
AllDisabled.args = {
  scheduleId: 'schedule-1',
};
AllDisabled.decorators = [
  Story => (
    <Provider
      store={mockStore({
        notifications: {
          settings: mockSettings.map(setting => ({
            ...setting,
            enabled: false,
          })),
          loading: false,
          error: null,
        },
      })}
    >
      <Story />
    </Provider>
  ),
];
