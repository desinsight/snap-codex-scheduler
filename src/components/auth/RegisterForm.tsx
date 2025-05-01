import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { register } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { validateEmail, validateName } from '../../utils/validation';
import { handleApiError } from '../../utils/errorHandling';
import { Form, Title, FormGroup, Label, Input, Button, ErrorMessage } from '../common/FormElements';

interface RegisterFormProps {
  className?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    } else if (!validateName(formData.name)) {
      newErrors.name = '이름은 2자 이상이어야 합니다';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
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
      await dispatch(register(formData)).unwrap();
      navigate('/login');
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
    <Form onSubmit={handleSubmit} className={className} data-testid="register-form">
      <Title>{t('auth.register.title')}</Title>
      
      {errors.general && (
        <ErrorMessage>{errors.general}</ErrorMessage>
      )}

      <FormGroup>
        <Label htmlFor="name">{t('auth.register.name')}</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          data-testid="register-name"
          hasError={!!errors.name}
        />
        {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">{t('auth.register.email')}</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          data-testid="register-email"
          hasError={!!errors.email}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="password">{t('auth.register.password')}</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          data-testid="register-password"
          hasError={!!errors.password}
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </FormGroup>

      <Button
        type="submit"
        disabled={!formData.name || !formData.email || !formData.password}
        data-testid="register-submit"
      >
        {t('auth.register.submit')}
      </Button>

      <Link to="/login" className="login-link">
        {t('auth.register.loginLink')}
      </Link>
    </Form>
  );
};

export default RegisterForm; 