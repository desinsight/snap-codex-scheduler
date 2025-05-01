import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { format } from 'date-fns';
import { createSchedule, updateSchedule, fetchScheduleById } from '../../store/slices/scheduleSlice';
import { Schedule, ScheduleCategory } from '../../types/schedule';
import { RootState } from '../../store';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 16px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
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

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CancelButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.gray};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.grayDark};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
`;

const ScheduleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { selectedSchedule, loading, error } = useSelector((state: RootState) => state.schedules);

  const [formData, setFormData] = useState<Partial<Schedule>>({
    title: '',
    description: '',
    startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    isAllDay: false,
    category: ScheduleCategory.WORK,
    isShared: false,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduleData = {
      ...formData,
      startDate: new Date(formData.startDate!),
      endDate: new Date(formData.endDate!),
    };

    if (id) {
      await dispatch(updateSchedule({ id, schedule: scheduleData }));
    } else {
      await dispatch(createSchedule(scheduleData));
    }

    if (!error) {
      navigate('/schedules');
    }
  };

  const handleCancel = () => {
    navigate('/schedules');
  };

  return (
    <FormContainer>
      <h2>{id ? t('actions.edit') : t('actions.create')}</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">{t('title')}</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">{t('description')}</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">{t('detail.startTime')}</Label>
          <Input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="endDate">{t('detail.endTime')}</Label>
          <Input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="isAllDay"
            name="isAllDay"
            checked={formData.isAllDay}
            onChange={handleChange}
          />
          <Label htmlFor="isAllDay">{t('allDay')}</Label>
        </CheckboxContainer>

        <FormGroup>
          <Label htmlFor="category">{t('filter.category')}</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {Object.values(ScheduleCategory).map(category => (
              <option key={category} value={category}>
                {t(`category.${category.toLowerCase()}`)}
              </option>
            ))}
          </Select>
        </FormGroup>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="isShared"
            name="isShared"
            checked={formData.isShared}
            onChange={handleChange}
          />
          <Label htmlFor="isShared">{t('shared')}</Label>
        </CheckboxContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            {t('common.cancel')}
          </CancelButton>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? t('common.saving') : (id ? t('actions.update') : t('actions.create'))}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default ScheduleForm; 