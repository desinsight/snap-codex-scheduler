import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { format } from 'date-fns';
import { createSchedule, updateSchedule, fetchScheduleById, } from '../../store/slices/scheduleSlice';
import { ScheduleCategory } from '../../types/schedule';
import Button from '../Button/Button';
import Card from '../Card/Card';
const FormContainer = styled(Card) `
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;
const FormGroup = styled.div `
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const Label = styled.label `
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;
const Input = styled.input `
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.paper};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;
const TextArea = styled.textarea `
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.paper};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;
const Select = styled.select `
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.paper};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;
const ParticipantChips = styled.div `
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;
const ParticipantChip = styled.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.primary.main}20;
  color: ${({ theme }) => theme.colors.primary.main};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
  }
`;
const ErrorMessage = styled.div `
  color: ${({ theme }) => theme.colors.error.main};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;
const ScheduleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('schedule');
    const { selectedSchedule, loading, error } = useSelector((state) => state.schedules);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        isAllDay: false,
        category: ScheduleCategory.WORK,
        isShared: false,
    });
    const [newParticipant, setNewParticipant] = useState('');
    useEffect(() => {
        if (id) {
            dispatch(fetchScheduleById(id));
        }
    }, [id, dispatch]);
    useEffect(() => {
        if (selectedSchedule) {
            setFormData({
                ...selectedSchedule,
                startDate: format(new Date(selectedSchedule.startDate), "yyyy-MM-dd'T'HH:mm"),
                endDate: format(new Date(selectedSchedule.endDate), "yyyy-MM-dd'T'HH:mm"),
            });
        }
    }, [selectedSchedule]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: new Date(value),
        }));
    };
    const handleAddParticipant = (e) => {
        if (e.key === 'Enter' && newParticipant.trim()) {
            e.preventDefault();
            setFormData(prev => ({
                ...prev,
                participants: [...(prev.participants || []), newParticipant.trim()],
            }));
            setNewParticipant('');
        }
    };
    const handleRemoveParticipant = (index) => {
        setFormData(prev => ({
            ...prev,
            participants: prev.participants?.filter((_, i) => i !== index),
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const scheduleData = {
            ...formData,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
        };
        if (id) {
            await dispatch(updateSchedule({ id, schedule: scheduleData }));
        }
        else {
            await dispatch(createSchedule(scheduleData));
        }
        if (!error) {
            navigate('/schedules');
        }
    };
    const handleCancel = () => {
        navigate('/schedules');
    };
    return (_jsxs(FormContainer, { children: [_jsx(Card.Header, { children: _jsx("h2", { children: id ? t('actions.edit') : t('actions.create') }) }), _jsx(Card.Content, { children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "title", children: t('title') }), _jsx(Input, { type: "text", id: "title", name: "title", value: formData.title, onChange: handleInputChange, required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "description", children: t('description') }), _jsx(TextArea, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "startDate", children: t('detail.startTime') }), _jsx(Input, { type: "datetime-local", id: "startDate", name: "startDate", value: formData.startDate, onChange: handleDateChange, required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "endDate", children: t('detail.endTime') }), _jsx(Input, { type: "datetime-local", id: "endDate", name: "endDate", value: formData.endDate, onChange: handleDateChange, required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "location", children: t('location') }), _jsx(Input, { type: "text", id: "location", name: "location", value: formData.location, onChange: handleInputChange })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "priority", children: t('priority') }), _jsxs(Select, { id: "priority", name: "priority", value: formData.priority, onChange: handleInputChange, required: true, children: [_jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "status", children: t('status') }), _jsxs(Select, { id: "status", name: "status", value: formData.status, onChange: handleInputChange, required: true, children: [_jsx("option", { value: "upcoming", children: "Upcoming" }), _jsx("option", { value: "ongoing", children: "Ongoing" }), _jsx("option", { value: "completed", children: "Completed" }), _jsx("option", { value: "cancelled", children: "Cancelled" })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "participants", children: t('participants') }), _jsx(Input, { type: "text", id: "participants", value: newParticipant, onChange: e => setNewParticipant(e.target.value), onKeyDown: handleAddParticipant, placeholder: "Type name and press Enter" }), _jsx(ParticipantChips, { children: formData.participants?.map((participant, index) => (_jsxs(ParticipantChip, { children: [participant, _jsx("button", { type: "button", onClick: () => handleRemoveParticipant(index), children: "\u00D7" })] }, index))) })] }), error && _jsx(ErrorMessage, { children: error }), _jsx(Card.Footer, { children: _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "outlined", color: "error", onClick: handleCancel, children: t('common.cancel') }), _jsx(Button, { type: "submit", color: "primary", disabled: loading, children: loading ? t('common.saving') : id ? t('actions.update') : t('actions.create') })] }) })] }) })] }));
};
export default ScheduleForm;
