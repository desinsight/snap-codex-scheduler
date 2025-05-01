import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../utils/i18n';
import RegisterForm from './RegisterForm';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import loadingReducer from '../../store/slices/loadingSlice';

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

const renderRegisterForm = () => {
  return render(
    <Provider store={mockStore}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <RegisterForm />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('이름 유효성 검사를 수행한다', async () => {
    renderRegisterForm();

    const nameInput = screen.getByTestId('register-name');
    fireEvent.change(nameInput, { target: { value: 'a' } });

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('이름은 2자 이상이어야 합니다')).toBeInTheDocument();
    });
  });

  it('이메일 유효성 검사를 수행한다', async () => {
    renderRegisterForm();

    const emailInput = screen.getByTestId('register-email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('올바른 이메일 형식이 아닙니다')).toBeInTheDocument();
    });
  });

  it('비밀번호 유효성 검사를 수행한다', async () => {
    renderRegisterForm();

    const passwordInput = screen.getByTestId('register-password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('비밀번호는 8자 이상이어야 합니다')).toBeInTheDocument();
    });
  });

  it('빈 필드에 대한 유효성 검사를 수행한다', async () => {
    renderRegisterForm();

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument();
      expect(screen.getByText('이메일을 입력해주세요')).toBeInTheDocument();
      expect(screen.getByText('비밀번호를 입력해주세요')).toBeInTheDocument();
    });
  });

  it('회원가입 성공 시 로그인 페이지로 이동한다', async () => {
    renderRegisterForm();

    const nameInput = screen.getByTestId('register-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('이미 사용 중인 이메일로 회원가입 시도 시 에러 메시지를 표시한다', async () => {
    renderRegisterForm();

    const nameInput = screen.getByTestId('register-name');
    const emailInput = screen.getByTestId('register-email');
    const passwordInput = screen.getByTestId('register-password');

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('이미 사용 중인 이메일입니다')).toBeInTheDocument();
    });
  });

  it('입력 시작 시 에러 메시지를 제거한다', async () => {
    renderRegisterForm();

    const submitButton = screen.getByTestId('register-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('이름을 입력해주세요')).toBeInTheDocument();
    });

    const nameInput = screen.getByTestId('register-name');
    fireEvent.change(nameInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.queryByText('이름을 입력해주세요')).not.toBeInTheDocument();
    });
  });
});
