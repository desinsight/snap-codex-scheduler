import React from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { Theme } from '../../types/theme';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  description?: string;
  location?: string;
  attendees?: string[];
  status?: 'pending' | 'confirmed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

const CalendarContainer = styled.div<{ theme: Theme }>`
  padding: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const StyledCalendar = styled(FullCalendar)<{ theme: Theme }>`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};

  .fc {
    height: 100%;
  }

  .fc-toolbar {
    padding: ${({ theme }) => theme.spacing.md};
  }

  .fc-toolbar-title {
    font-size: ${({ theme }) => theme.typography.h5.fontSize} !important;
    font-weight: ${({ theme }) => theme.typography.h5.fontWeight} !important;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  .fc-button {
    background-color: ${({ theme }) => theme.colors.primary.main} !important;
    border-color: ${({ theme }) => theme.colors.primary.main} !important;
    font-weight: ${({ theme }) => theme.typography.button.fontWeight} !important;
    text-transform: none !important;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`} !important;
    transition: all ${({ theme }) => theme.transitions.duration.short}ms
      ${({ theme }) => theme.transitions.easing.easeInOut} !important;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary.dark} !important;
      border-color: ${({ theme }) => theme.colors.primary.dark} !important;
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.text.tertiary} !important;
      border-color: ${({ theme }) => theme.colors.text.tertiary} !important;
    }
  }

  .fc-button-active {
    background-color: ${({ theme }) => theme.colors.primary.dark} !important;
    border-color: ${({ theme }) => theme.colors.primary.dark} !important;
  }

  .fc-event {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};
    padding: ${({ theme }) => theme.spacing.xs};
    margin: ${({ theme }) => theme.spacing.xs} 0;
    border-radius: ${({ theme }) => theme.shape.borderRadius};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.duration.short}ms
      ${({ theme }) => theme.transitions.easing.easeInOut};

    &:hover {
      transform: translateY(-1px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }

  .fc-day-today {
    background-color: ${({ theme }) => theme.colors.primary.main}10 !important;
  }

  .fc-day-header {
    font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
    color: ${({ theme }) => theme.colors.text.primary};
    padding: ${({ theme }) => theme.spacing.sm} !important;
  }

  .fc-day {
    border-color: ${({ theme }) => theme.colors.divider} !important;
  }

  .fc-timegrid-slot {
    height: 48px !important;
  }
`;

interface CalendarViewProps {
  events: EventInput[];
  onEventClick?: (info: any) => void;
  onDateSelect?: (info: any) => void;
  onEventDrop?: (info: any) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventClick,
  onDateSelect,
  onEventDrop,
}) => {
  return (
    <CalendarContainer>
      <StyledCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        eventClick={onEventClick}
        select={onDateSelect}
        eventDrop={onEventDrop}
        height="100%"
      />
    </CalendarContainer>
  );
};

export default CalendarView;
