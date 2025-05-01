import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18n from '../../../i18n';
import NotificationTemplateManager from './NotificationTemplateManager';
import { NotificationTemplate } from '../../types/notification';

const mockStore = configureStore([thunk]);

describe('NotificationTemplateManager', () => {
  const mockTemplates: NotificationTemplate[] = [
    {
      id: '1',
      type: 'email',
      name: 'Meeting Reminder',
      subject: 'Upcoming Meeting: {title}',
      content: 'You have a meeting {title} starting at {startDate}',
      variables: ['{title}', '{startDate}'],
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      type: 'browser',
      name: 'Task Due',
      content: 'Task {title} is due in {time}',
      variables: ['{title}', '{time}'],
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const renderComponent = (initialState = {}) => {
    const store = mockStore({
      notificationTemplates: {
        templates: mockTemplates,
        loading: false,
        error: null,
      },
      ...initialState,
    });

    return render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationTemplateManager />
        </I18nextProvider>
      </Provider>
    );
  };

  it('renders notification templates title', () => {
    renderComponent();
    expect(screen.getByText('알림 템플릿')).toBeInTheDocument();
  });

  it('renders template list', () => {
    renderComponent();
    expect(screen.getByText('Meeting Reminder')).toBeInTheDocument();
    expect(screen.getByText('Task Due')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderComponent({
      notificationTemplates: {
        templates: [],
        loading: true,
        error: null,
      },
    });
    expect(screen.getByText('템플릿을 불러오는 중...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    const errorMessage = 'Failed to fetch templates';
    renderComponent({
      notificationTemplates: {
        templates: [],
        loading: false,
        error: errorMessage,
      },
    });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('creates new template', async () => {
    const store = mockStore({
      notificationTemplates: {
        templates: [],
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationTemplateManager />
        </I18nextProvider>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('템플릿 이름'), {
      target: { value: 'New Template' },
    });
    fireEvent.change(screen.getByPlaceholderText('내용'), {
      target: { value: 'New content {title}' },
    });
    fireEvent.click(screen.getByText('템플릿 생성'));

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('notificationTemplates/createTemplate/pending');
    });
  });

  it('deletes template', async () => {
    const store = mockStore({
      notificationTemplates: {
        templates: mockTemplates,
        loading: false,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NotificationTemplateManager />
        </I18nextProvider>
      </Provider>
    );

    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('notificationTemplates/deleteTemplate/pending');
    });
  });

  it('inserts variable into content', () => {
    renderComponent();
    const variableTag = screen.getByText('{title}');
    fireEvent.click(variableTag);
    expect(screen.getByPlaceholderText('내용')).toHaveValue('{title}');
  });

  it('shows subject field for email templates', () => {
    renderComponent();
    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'email' } });
    expect(screen.getByPlaceholderText('제목')).toBeInTheDocument();
  });

  it('hides subject field for browser templates', () => {
    renderComponent();
    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'browser' } });
    expect(screen.queryByPlaceholderText('제목')).not.toBeInTheDocument();
  });
});
