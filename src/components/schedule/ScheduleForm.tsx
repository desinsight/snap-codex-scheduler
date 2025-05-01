import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  createSchedule,
  updateSchedule,
  fetchScheduleById,
} from '../../store/slices/scheduleSlice';
import { Schedule, ScheduleCategory } from '../../types/schedule';
import { RootState } from '../../store';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Button from '../Button/Button';
import Card from '../Card/Card';

const FormContainer = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
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

const TextArea = styled.textarea`
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

const Select = styled.select`
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

const ParticipantChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ParticipantChip = styled.div`
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

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error.main};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleAddParticipant = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newParticipant.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        participants: [...(prev.participants || []), newParticipant.trim()],
      }));
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => i !== index),
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
      <Card.Header>
        <h2>{id ? t('actions.edit') : t('actions.create')}</h2>
      </Card.Header>
      <Card.Content>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">{t('description')}</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="startDate">{t('detail.startTime')}</Label>
            <Input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleDateChange}
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
              onChange={handleDateChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="priority">{t('priority')}</Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">{t('status')}</Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="participants">{t('participants')}</Label>
            <Input
              type="text"
              id="participants"
              value={newParticipant}
              onChange={e => setNewParticipant(e.target.value)}
              onKeyDown={handleAddParticipant}
              placeholder="Type name and press Enter"
            />
            <ParticipantChips>
              {formData.participants?.map((participant, index) => (
                <ParticipantChip key={index}>
                  {participant}
                  <button type="button" onClick={() => handleRemoveParticipant(index)}>
                    ×
                  </button>
                </ParticipantChip>
              ))}
            </ParticipantChips>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Card.Footer>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="error" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? t('common.saving') : id ? t('actions.update') : t('actions.create')}
              </Button>
            </div>
          </Card.Footer>
        </form>
      </Card.Content>
    </FormContainer>
  );
};

export default ScheduleForm;
