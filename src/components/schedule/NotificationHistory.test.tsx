import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from '../../store';
import theme from '../../styles/theme';
import NotificationHistory from '../NotificationHistory';
import { NotificationHistory as NotificationHistoryType } from '../../types/notification';

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

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <NotificationHistory scheduleId="123" />
        </ThemeProvider>
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

  it('renders loading spinner when loading', () => {
    renderComponent();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    store.dispatch({ type: 'notifications/setError', payload: 'Error message' });
    renderComponent();
    expect(screen.getByText('notifications.error.fetchFailed')).toBeInTheDocument();
  });

  it('renders empty message when there is no history', () => {
    store.dispatch({ type: 'notifications/setHistory', payload: [] });
    renderComponent();
    expect(screen.getByText('notifications.empty')).toBeInTheDocument();
  });
}); 