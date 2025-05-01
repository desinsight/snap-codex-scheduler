import React from 'react';
import styled from 'styled-components';
import { CalendarEvent } from './CalendarView';
import Button from '../common/Button';

interface EventPopoverProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PopoverContainer = styled.div`
  position: absolute;
  z-index: 1000;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.space.lg};
  min-width: 300px;
  max-width: 400px;
`;

const EventTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
`;

const EventTime = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.xs};
`;

const EventCategory = styled.div<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ color }) => color || 'transparent'}15;
  color: ${({ color }) => color};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space.sm};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ color }) => color};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.lg};
`;

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const EventPopover: React.FC<EventPopoverProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  const categoryColor = event.color || getCategoryColor(event.category);

  return (
    <PopoverContainer>
      <EventTitle>{event.title}</EventTitle>
      <EventTime>
        {formatDateTime(event.startDate)}
        {event.endDate && ` - ${formatDateTime(event.endDate)}`}
      </EventTime>
      <EventCategory color={categoryColor}>
        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
      </EventCategory>
      
      <Actions>
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            수정
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            삭제
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClose}>
          닫기
        </Button>
      </Actions>
    </PopoverContainer>
  );
};

export default EventPopover; 