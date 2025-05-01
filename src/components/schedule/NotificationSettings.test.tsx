import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import NotificationSettings from './NotificationSettings';
import { NotificationSettings as NotificationSettingsType } from '../../types/notification';

const mockStore = configureStore([thunk]);

describe('NotificationSettings', () => {
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

  const renderComponent = (initialState = {}) => {
    const store = mockStore({
      notifications: {
        settings: mockSettings,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationSettings scheduleId="schedule-1" />
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders notification settings title', () => {
    renderComponent();
    expect(screen.getByText('알림 설정')).toBeInTheDocument();
  });

  it('renders both email and browser notification options', () => {
    renderComponent();
    expect(screen.getByText('이메일 알림')).toBeInTheDocument();
    expect(screen.getByText('브라우저 알림')).toBeInTheDocument();
  });

  it('shows time selection dropdown when notification is enabled', () => {
    renderComponent();
    const emailCheckbox = screen.getByLabelText('이메일 알림');
    expect(emailCheckbox).toBeChecked();
    expect(screen.getByDisplayValue('10분 전')).toBeInTheDocument();
  });

  it('hides time selection dropdown when notification is disabled', () => {
    renderComponent();
    const browserCheckbox = screen.getByLabelText('브라우저 알림');
    expect(browserCheckbox).not.toBeChecked();
    expect(screen.queryByDisplayValue('30분 전')).not.toBeInTheDocument();
  });

  it('dispatches update action when checkbox is clicked', () => {
    const store = mockStore({
      notifications: {
        settings: mockSettings,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationSettings scheduleId="schedule-1" />
        </I18nextProvider>
      </Provider>
    );

    const browserCheckbox = screen.getByLabelText('브라우저 알림');
    fireEvent.click(browserCheckbox);

    const actions = store.getActions();
    expect(actions[0].type).toBe('notifications/updateSettings/pending');
  });

  it('dispatches update action when time is changed', () => {
    const store = mockStore({
      notifications: {
        settings: mockSettings,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationSettings scheduleId="schedule-1" />
        </I18nextProvider>
      </Provider>
    );

    const timeSelect = screen.getByDisplayValue('10분 전');
    fireEvent.change(timeSelect, { target: { value: '30' } });

    const actions = store.getActions();
    expect(actions[0].type).toBe('notifications/updateSettings/pending');
  });

  it('shows loading state', () => {
    renderComponent({
      notifications: {
        settings: [],
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('알림 설정을 불러오는 중...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to fetch notification settings';
    renderComponent({
      notifications: {
        settings: [],
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 