import React from 'react';
import styled, { css } from 'styled-components';
import { useDrop } from 'react-dnd';
import { CalendarEvent } from './CalendarView';
import DraggableEvent from './DraggableEvent';
import { isSameDay } from 'date-fns';
import { Theme } from '../../types/theme';

interface DroppableDayProps {
  date: Date;
  events: CalendarEvent[];
  isToday?: boolean;
  isSelected?: boolean;
  isWeekend?: boolean;
  isOtherMonth?: boolean;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onEventDrop: (event: CalendarEvent, date: Date) => void;
  onDayClick: () => void;
}

const DayCell = styled.div<{
  isToday?: boolean;
  isSelected?: boolean;
  isOver?: boolean;
  theme: Theme;
}>`
  min-height: 120px;
  border-right: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ isSelected, isOver, theme }) =>
    isOver
      ? `${theme.colors.primary.main}05`
      : isSelected
      ? `${theme.colors.primary.main}10`
      : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.duration.short}ms ${({ theme }) => theme.transitions.easing.easeInOut};
  cursor: pointer;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background.paper};
  }

  ${({ isToday, theme }) =>
    isToday &&
    css`
      box-shadow: inset 0 0 0 1px ${theme.colors.primary.main};
    `}
`;

const DayNumber = styled.div<{
  isToday?: boolean;
  isWeekend?: boolean;
  isOtherMonth?: boolean;
  theme: Theme;
}>`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  font-weight: ${({ isToday }) => (isToday ? 600 : 400)};
  color: ${({ isWeekend, isOtherMonth, theme }) =>
    isOtherMonth
      ? theme.colors.text.tertiary
      : isWeekend
      ? theme.colors.error
      : theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EventList = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MoreEventsIndicator = styled.div<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const MAX_VISIBLE_EVENTS = 3;

const DroppableDay: React.FC<DroppableDayProps> = ({
  date,
  events,
  isToday,
  isSelected,
  isWeekend,
  isOtherMonth,
  onEventClick,
  onEventDrop,
  onDayClick,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'EVENT',
    drop: (item: { event: CalendarEvent }) => {
      onEventDrop(item.event, date);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
  const remainingEvents = events.length - MAX_VISIBLE_EVENTS;

  return (
    <DayCell
      ref={drop}
      isToday={isToday}
      isSelected={isSelected}
      isOver={isOver}
      onClick={onDayClick}
    >
      <DayNumber
        isToday={isToday}
        isWeekend={isWeekend}
        isOtherMonth={isOtherMonth}
      >
        {date.getDate()}
      </DayNumber>
      <EventList>
        {visibleEvents.map(event => (
          <DraggableEvent
            key={event.id}
            event={event}
            onClick={(e) => onEventClick(event, e)}
            isStart={isSameDay(event.startDate, date)}
            isEnd={isSameDay(event.endDate, date)}
          />
        ))}
        {remainingEvents > 0 && (
          <MoreEventsIndicator>
            +{remainingEvents} more
          </MoreEventsIndicator>
        )}
      </EventList>
    </DayCell>
  );
};

export default DroppableDay; 