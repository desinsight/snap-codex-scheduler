import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { validateEmail } from '../../utils/validation';
import { handleApiError } from '../../utils/errorHandling';
import { Form, Title, FormGroup, Label, Input, Button, ErrorMessage } from '../common/FormElements';

interface LoginFormProps {
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(setLoading(true));
      await dispatch(login(formData)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = handleApiError(error);
      setErrors(prev => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <Form onSubmit={handleSubmit} className={className} data-testid="login-form">
      <Title data-testid="login-title">{t('auth.login.title')}</Title>
      
      {errors.general && (
        <ErrorMessage>{errors.general}</ErrorMessage>
      )}

      <FormGroup>
        <Label htmlFor="email">{t('auth.login.email')}</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          data-testid="login-email"
          hasError={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">{t('auth.login.password')}</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          data-testid="login-password"
          hasError={!!errors.password}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>
          <input
            type="checkbox"
            name="remember"
            data-testid="login-remember"
          />
          {t('auth.login.rememberMe')}
        </Label>
      </FormGroup>

      <Button
        type="submit"
        disabled={!formData.email || !formData.password}
        data-testid="login-submit"
      >
        {t('auth.login.submit')}
      </Button>

      <Link to="/register" data-testid="register-link">
        {t('auth.login.registerLink')}
      </Link>
    </Form>
  );
};

export default LoginForm; 