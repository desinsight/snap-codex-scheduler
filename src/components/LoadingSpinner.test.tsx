import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider } from 'react-i18next';
import i18next from '../utils/i18n';
import LoadingSpinner from './LoadingSpinner';
import loadingReducer from '../store/slices/loadingSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      loading: loadingReducer,
    },
    preloadedState: {
      loading: {
        isLoading: false,
        loadingMessage: null,
        loadingProgress: null,
        ...initialState,
      },
    },
  });
};

describe('LoadingSpinner', () => {
  it('should not render when isLoading is false', () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render with default message when isLoading is true', () => {
    const store = createTestStore({
      isLoading: true,
    });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('로그인 중...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    const store = createTestStore({
      isLoading: true,
      loadingMessage: 'Custom loading message',
    });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });

  it('should render progress bar when loadingProgress is provided', () => {
    const store = createTestStore({
      isLoading: true,
      loadingProgress: 50,
    });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('should not render progress bar when loadingProgress is null', () => {
    const store = createTestStore({
      isLoading: true,
      loadingProgress: null,
    });
    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should update progress bar when loadingProgress changes', () => {
    const store = createTestStore({
      isLoading: true,
      loadingProgress: 30,
    });
    const { rerender } = render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '30%' });

    // Update store with new progress
    store.dispatch({
      type: 'loading/updateLoadingProgress',
      payload: 70,
    });

    rerender(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LoadingSpinner />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '70%' });
  });
});
