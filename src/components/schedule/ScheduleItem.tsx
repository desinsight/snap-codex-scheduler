import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Schedule, ScheduleCategory } from '../../types/schedule';
import { format } from 'date-fns';

const ScheduleCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ScheduleTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
`;

const ScheduleCategoryBadge = styled.span<{ category: ScheduleCategory }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.category) {
      case ScheduleCategory.WORK:
        return '#e3f2fd';
      case ScheduleCategory.PERSONAL:
        return '#f3e5f5';
      case ScheduleCategory.EDUCATION:
        return '#e8f5e9';
      case ScheduleCategory.HEALTH:
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.category) {
      case ScheduleCategory.WORK:
        return '#1976d2';
      case ScheduleCategory.PERSONAL:
        return '#7b1fa2';
      case ScheduleCategory.EDUCATION:
        return '#2e7d32';
      case ScheduleCategory.HEALTH:
        return '#e65100';
      default:
        return '#616161';
    }
  }};
`;

const ScheduleDescription = styled.p`
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
`;

const ScheduleTime = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ScheduleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
`;

const ScheduleActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const SharedBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #e3f2fd;
  color: #1976d2;
`;

interface ScheduleItemProps {
  schedule: Schedule;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule }) => {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy HH:mm');
  };

  return (
    <ScheduleCard>
      <ScheduleHeader>
        <ScheduleTitle>{schedule.title}</ScheduleTitle>
        <ScheduleCategoryBadge category={schedule.category}>
          {t(`schedule.category.${schedule.category.toLowerCase()}`)}
        </ScheduleCategoryBadge>
      </ScheduleHeader>

      {schedule.description && (
        <ScheduleDescription>{schedule.description}</ScheduleDescription>
      )}

      <ScheduleTime>
        {schedule.isAllDay
          ? t('schedule.allDay')
          : `${formatDate(schedule.startDate)} - ${formatDate(schedule.endDate)}`}
      </ScheduleTime>

      <ScheduleFooter>
        <ScheduleActions>
          <ActionButton>{t('schedule.actions.edit')}</ActionButton>
          <ActionButton>{t('schedule.actions.delete')}</ActionButton>
        </ScheduleActions>

        {schedule.isShared && (
          <SharedBadge>{t('schedule.shared')}</SharedBadge>
        )}
      </ScheduleFooter>
    </ScheduleCard>
  );
};

export default ScheduleItem; 