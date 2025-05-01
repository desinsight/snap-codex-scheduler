import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import loadingReducer from '../../store/slices/loadingSlice';
import LoginForm from './LoginForm';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

<<<<<<< HEAD
=======
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
const renderLoginForm = () => {
  return render(
    <Provider store={mockStore}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('이메일 유효성 검사를 수행한다', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByTestId('login-email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const errorMessage = screen.getByText('올바른 이메일 형식이 아닙니다');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('빈 필드에 대한 유효성 검사를 수행한다', async () => {
    renderLoginForm();
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
      expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
    });
  });

  it('로그인 성공 시 대시보드로 이동한다', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('로그인 실패 시 에러 메시지를 표시한다', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByTestId('login-email');
    const passwordInput = screen.getByTestId('login-password');
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'WrongPassword123!' } });
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다')).toBeInTheDocument();
    });
  });

  it('입력 시작 시 에러 메시지를 제거한다', async () => {
    renderLoginForm();
    
    const submitButton = screen.getByTestId('login-submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
    });
    
    const emailInput = screen.getByTestId('login-email');
    fireEvent.change(emailInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect(screen.queryByText('이메일을 입력해주세요')).not.toBeInTheDocument();
    });
  });
}); 