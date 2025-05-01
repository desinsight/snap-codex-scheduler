import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleImportExport from './ScheduleImportExport';

const mockStore = configureStore([thunk]);

export default {
  title: 'Components/Schedule/ScheduleImportExport',
  component: ScheduleImportExport,
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

const Template: Story = () => {
  const store = mockStore({
    schedules: {
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleImportExport />
    </Provider>
  );
};

export const Default = Template.bind({});

export const Loading = () => {
  const store = mockStore({
    schedules: {
      loading: true,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleImportExport />
    </Provider>
  );
};

export const Error = () => {
  const store = mockStore({
    schedules: {
      loading: false,
      error: 'Failed to export/import schedules',
    },
  });

  return (
    <Provider store={store}>
      <ScheduleImportExport />
    </Provider>
  );
};

export const ExportSuccess = () => {
  const store = mockStore({
    schedules: {
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleImportExport />
    </Provider>
  );
};

export const ImportSuccess = () => {
  const store = mockStore({
    schedules: {
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleImportExport />
    </Provider>
  );
}; 