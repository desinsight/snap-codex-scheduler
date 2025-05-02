import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { shareSchedule } from '../../store/slices/scheduleSlice';
const ShareContainer = styled.div `
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroup = styled.div `
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label `
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;
const Input = styled.input `
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
const Button = styled.button `
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ShareButton = styled(Button) `
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
const CancelButton = styled(Button) `
  background-color: ${({ theme }) => theme.colors.gray};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.grayDark};
  }
`;
const ErrorMessage = styled.div `
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
`;
const SuccessMessage = styled.div `
  color: ${({ theme }) => theme.colors.success};
  font-size: 14px;
`;
const ScheduleShare = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation('schedule');
    const { loading, error } = useSelector((state) => state.schedules);
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (id) {
            await dispatch(shareSchedule({ id, email }));
            if (!error) {
                setSuccess(true);
                setEmail('');
            }
        }
    };
    const handleCancel = () => {
        window.history.back();
    };
    return (_jsxs(ShareContainer, { children: [_jsx(Title, { children: t('actions.share') }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "email", children: t('share.email') }), _jsx(Input, { type: "email", id: "email", value: email, onChange: e => setEmail(e.target.value), placeholder: t('share.emailPlaceholder'), required: true })] }), error && _jsx(ErrorMessage, { children: error }), success && _jsx(SuccessMessage, { children: t('share.success') }), _jsxs(ButtonGroup, { children: [_jsx(CancelButton, { type: "button", onClick: handleCancel, children: t('common.cancel') }), _jsx(ShareButton, { type: "submit", disabled: loading, children: loading ? t('common.sharing') : t('actions.share') })] })] })] }));
};
export default ScheduleShare;
