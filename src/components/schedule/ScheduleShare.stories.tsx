import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import ScheduleShare from './ScheduleShare';

const mockStore = configureStore([thunk]);

export default {
  title: 'Components/Schedule/ScheduleShare',
  component: ScheduleShare,
  decorators: [
    Story => (
      <Provider store={mockStore({})}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/schedules/1/share']}>
            <Routes>
              <Route path="/schedules/:id/share" element={<Story />} />
            </Routes>
          </MemoryRouter>
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
      <ScheduleShare />
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
      <ScheduleShare />
    </Provider>
  );
};

export const Error = () => {
  const store = mockStore({
    schedules: {
      loading: false,
      error: 'Failed to share schedule',
    },
  });

  return (
    <Provider store={store}>
      <ScheduleShare />
    </Provider>
  );
};

export const Success = () => {
  const store = mockStore({
    schedules: {
      loading: false,
      error: null,
    },
  });

  return (
    <Provider store={store}>
      <ScheduleShare />
    </Provider>
  );
};
