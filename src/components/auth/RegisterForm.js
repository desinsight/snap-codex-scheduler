import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { register } from '../../store/slices/authSlice';
import { setLoading } from '../../store/slices/loadingSlice';
import { validateEmail, validateName } from '../../utils/validation';
import { handleApiError } from '../../utils/errorHandling';
import { Form, Title, FormGroup, Label, Input, Button, ErrorMessage } from '../common/FormElements';
const RegisterForm = ({ className = '' }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = '이름을 입력해주세요';
        }
        else if (!validateName(formData.name)) {
            newErrors.name = '이름은 2자 이상이어야 합니다';
        }
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
        }
        else if (!validateEmail(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다';
        }
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요';
        }
        else if (formData.password.length < 8) {
            newErrors.password = '비밀번호는 8자 이상이어야 합니다';
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
            await dispatch(register(formData)).unwrap();
            navigate('/login');
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
    return (_jsxs(Form, { onSubmit: handleSubmit, className: className, "data-testid": "register-form", children: [_jsx(Title, { children: t('auth.register.title') }), errors.general && _jsx(ErrorMessage, { children: errors.general }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "name", children: t('auth.register.name') }), _jsx(Input, { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, "data-testid": "register-name", hasError: !!errors.name }), errors.name && _jsx(ErrorMessage, { children: errors.name })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "email", children: t('auth.register.email') }), _jsx(Input, { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, "data-testid": "register-email", hasError: !!errors.email }), errors.email && _jsx(ErrorMessage, { children: errors.email })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "password", children: t('auth.register.password') }), _jsx(Input, { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, "data-testid": "register-password", hasError: !!errors.password }), errors.password && _jsx(ErrorMessage, { children: errors.password })] }), _jsx(Button, { type: "submit", disabled: !formData.name || !formData.email || !formData.password, "data-testid": "register-submit", children: t('auth.register.submit') }), _jsx(Link, { to: "/login", className: "login-link", children: t('auth.register.loginLink') })] }));
};
export default RegisterForm;
