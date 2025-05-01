import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import NotificationHistory from './NotificationHistory';
import { NotificationHistory as NotificationHistoryType } from '../../types/notification';

const mockStore = configureStore([thunk]);

describe('NotificationHistory', () => {
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

  const renderComponent = (initialState = {}) => {
    const store = mockStore({
      notifications: {
        history: mockHistory,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationHistory scheduleId="schedule-1" />
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders notification history title', () => {
    renderComponent();
    expect(screen.getByText('알림 기록')).toBeInTheDocument();
  });

  it('renders notification history items', () => {
    renderComponent();
    expect(screen.getByText('이메일 알림')).toBeInTheDocument();
    expect(screen.getByText('브라우저 알림')).toBeInTheDocument();
  });

  it('shows success status for successful notifications', () => {
    renderComponent();
    const successStatus = screen.getAllByText('성공');
    expect(successStatus[0]).toHaveStyle({ color: '#4CAF50' });
  });

  it('shows failed status for failed notifications', () => {
    renderComponent();
    const failedStatus = screen.getAllByText('실패');
    expect(failedStatus[0]).toHaveStyle({ color: '#F44336' });
  });

  it('formats dates correctly', () => {
    renderComponent();
    const dateElements = screen.getAllByText(/2024/);
    expect(dateElements.length).toBe(2);
  });

  it('shows empty state when no history exists', () => {
    renderComponent({
      notifications: {
        history: [],
        loading: false,
        error: null,
      },
    });

    expect(screen.getByText('알림 기록이 없습니다')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderComponent({
      notifications: {
        history: [],
        loading: true,
        error: null,
      },
    });

    expect(screen.getByText('알림 설정을 불러오는 중...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to fetch notification history';
    renderComponent({
      notifications: {
        history: [],
        loading: false,
        error: errorMessage,
      },
    });

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
}); 