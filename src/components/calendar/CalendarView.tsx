import React from 'react';
import styled, { css } from 'styled-components';
import Button from '../common/Button';
import MonthNavigation from './MonthNavigation';
import EventPopover from './EventPopover';

interface CalendarEvent {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  category: 'meeting' | 'task' | 'deadline' | 'other';
  color?: string;
  isMultiDay?: boolean;
  startDate: Date;
  endDate: Date;
}

interface CalendarViewProps {
  currentDate?: Date;
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

const CalendarContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 800px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const MonthYear = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 600;
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
`;

const WeekDay = styled.div<{ isWeekend?: boolean }>`
  color: ${({ isWeekend, theme }) => 
    isWeekend ? theme.colors.danger : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  text-align: left;
  padding: ${({ theme }) => theme.space.sm};
  border-right: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;

  &:last-child {
    border-right: none;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

interface DayProps {
  isToday?: boolean;
  isSelected?: boolean;
  isWeekend?: boolean;
  isOtherMonth?: boolean;
}

const DayCell = styled.div<DayProps>`
  min-height: 120px;
  border-right: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  padding: ${({ theme }) => theme.space.xs};
  background: ${({ isSelected, theme }) =>
    isSelected ? `${theme.colors.primary}10` : 'transparent'};
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

const DayNumber = styled.div<DayProps>`
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

const EventItem = styled.div<{ color?: string; isMultiDay?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ color }) => color || 'transparent'}15;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  cursor: pointer;
  margin: 1px 0;
  position: relative;
  
  ${({ isMultiDay }) =>
    isMultiDay &&
    css`
      margin-left: -${({ theme }) => theme.space.xs};
      margin-right: -${({ theme }) => theme.space.xs};
      border-radius: 0;
      
      &:first-of-type {
        border-top-left-radius: ${({ theme }) => theme.radii.sm};
        border-bottom-left-radius: ${({ theme }) => theme.radii.sm};
      }
      
      &:last-of-type {
        border-top-right-radius: ${({ theme }) => theme.radii.sm};
        border-bottom-right-radius: ${({ theme }) => theme.radii.sm};
      }
    `}

  &:hover {
    background: ${({ color }) => color || 'transparent'}25;
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ color }) => color || 'transparent'};
    flex-shrink: 0;
  }
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

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate = new Date(),
  events = [],
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(currentDate);
  const [displayDate, setDisplayDate] = React.useState<Date>(currentDate);
  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [popoverPosition, setPopoverPosition] = React.useState({ top: 0, left: 0 });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isOtherMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isOtherMonth: true,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      });
    }
    
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Check if the date falls within the event's date range
      return (
        date >= eventStart &&
        date <= eventEnd
      );
    });
  };

  const isEventStart = (event: CalendarEvent, date: Date) => {
    return isSameDay(new Date(event.startDate), date);
  };

  const isEventEnd = (event: CalendarEvent, date: Date) => {
    return isSameDay(new Date(event.endDate), date);
  };

  const getCategoryColor = (category: CalendarEvent['category']) => {
    const colors = {
      meeting: '#2D5BFF',
      task: '#00C48C',
      deadline: '#FF647C',
      other: '#6E6A7C',
    };
    return colors[category];
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const handlePrevMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setDisplayDate(today);
    setSelectedDate(today);
    onDateSelect?.(today);
  };

  const MAX_VISIBLE_EVENTS = 3;

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setSelectedEvent(event);
  };

  const handleEventEdit = () => {
    // Implement event edit logic
    setSelectedEvent(null);
  };

  const handleEventDelete = () => {
    // Implement event delete logic
    setSelectedEvent(null);
  };

  const renderEvents = (date: Date) => {
    const dateEvents = getEventsForDate(date);
    const visibleEvents = dateEvents.slice(0, MAX_VISIBLE_EVENTS);
    const remainingEvents = dateEvents.length - MAX_VISIBLE_EVENTS;

    return (
      <EventList>
        {visibleEvents.map(event => (
          <EventItem
            key={event.id}
            color={event.color || getCategoryColor(event.category)}
            isMultiDay={event.isMultiDay}
            onClick={(e) => handleEventClick(event, e)}
          >
            {event.startTime && isEventStart(event, date) && `${event.startTime} `}
            {event.title}
          </EventItem>
        ))}
        {remainingEvents > 0 && (
          <MoreEventsIndicator>
            +{remainingEvents} more
          </MoreEventsIndicator>
        )}
      </EventList>
    );
  };

  return (
    <CalendarContainer>
      <MonthNavigation
        currentDate={displayDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onTodayClick={handleTodayClick}
      />

      <WeekDaysGrid>
        {weekDays.map((day, index) => (
          <WeekDay key={day} isWeekend={index === 0 || index === 6}>
            {day}
          </WeekDay>
        ))}
      </WeekDaysGrid>

      <DaysGrid>
        {getDaysInMonth(displayDate).map(({ date, isToday, isSelected, isOtherMonth, isWeekend }) => (
          <DayCell
            key={date.toISOString()}
            isToday={isToday}
            isSelected={isSelected}
            onClick={() => handleDateClick(date)}
            onMouseEnter={() => setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            <DayNumber
              isToday={isToday}
              isWeekend={isWeekend}
              isOtherMonth={isOtherMonth}
            >
              {date.getDate()}
            </DayNumber>
            {renderEvents(date)}
          </DayCell>
        ))}
      </DaysGrid>

      {selectedEvent && (
        <div style={{ position: 'absolute', top: popoverPosition.top, left: popoverPosition.left }}>
          <EventPopover
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={handleEventEdit}
            onDelete={handleEventDelete}
          />
        </div>
      )}
    </CalendarContainer>
  );
}; 