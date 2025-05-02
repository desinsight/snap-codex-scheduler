import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { login } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { validateEmail } from '../../utils/validation';
import { handleApiError } from '../../utils/errorHandling';
import { Form, Title, FormGroup, Label, Input, Button, ErrorMessage } from '../common/FormElements';
const LoginForm = ({ className = '' }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
        }
        else if (!validateEmail(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        }
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            dispatch(setLoading(true));
            await dispatch(login(formData)).unwrap();
            navigate('/dashboard');
        }
        catch (error) {
            const errorMessage = handleApiError(error);
            setErrors(prev => ({
                ...prev,
                general: errorMessage,
            }));
        }
        finally {
            dispatch(setLoading(false));
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };
    return (_jsxs(Form, { onSubmit: handleSubmit, className: className, "data-testid": "login-form", children: [_jsx(Title, { "data-testid": "login-title", children: t('auth.login.title') }), errors.general && _jsx(ErrorMessage, { children: errors.general }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "email", children: t('auth.login.email') }), _jsx(Input, { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, "data-testid": "login-email", hasError: !!errors.email }), errors.email && _jsx(ErrorMessage, { children: errors.email })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "password", children: t('auth.login.password') }), _jsx(Input, { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, "data-testid": "login-password", hasError: !!errors.password }), errors.password && _jsx(ErrorMessage, { children: errors.password })] }), _jsx(FormGroup, { children: _jsxs(Label, { children: [_jsx("input", { type: "checkbox", name: "remember", "data-testid": "login-remember" }), t('auth.login.rememberMe')] }) }), _jsx(Button, { type: "submit", disabled: !formData.email || !formData.password, "data-testid": "login-submit", children: t('auth.login.submit') }), _jsx(Link, { to: "/register", "data-testid": "register-link", children: t('auth.login.registerLink') })] }));
};
export default LoginForm;
