import React from 'react';
import styled from 'styled-components';
import { useDrop } from 'react-dnd';
import { CalendarEvent } from './CalendarView';
import DraggableEvent from './DraggableEvent';

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
}>`
  min-height: 120px;
  border-right: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  padding: ${({ theme }) => theme.space.xs};
  background: ${({ isSelected, isOver, theme }) =>
    isOver
      ? `${theme.colors.primary}05`
      : isSelected
      ? `${theme.colors.primary}10`
      : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }

  ${({ isToday, theme }) =>
    isToday &&
    css`
      box-shadow: inset 0 0 0 1px ${theme.colors.primary};
    `}
`;

const DayNumber = styled.div<{
  isToday?: boolean;
  isWeekend?: boolean;
  isOtherMonth?: boolean;
}>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ isToday }) => (isToday ? 600 : 400)};
  color: ${({ isWeekend, isOtherMonth, theme }) =>
    isOtherMonth
      ? theme.colors.text.tertiary
      : isWeekend
      ? theme.colors.danger
      : theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const MoreEventsIndicator = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.space.xs};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
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