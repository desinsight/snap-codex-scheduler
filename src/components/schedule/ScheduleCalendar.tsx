import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { RootState } from '../../store';
import { Schedule } from '../../types/schedule';
import { updateSchedule } from '../../store/slices/scheduleSlice';
import ScheduleForm from './ScheduleForm';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
  ko: require('date-fns/locale/ko'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarContainer = styled.div`
  height: 800px;
  margin: 20px;
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ViewButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ active, theme }) => (active ? theme.colors.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? 'white' : theme.colors.text)};
  cursor: pointer;

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primaryDark : theme.colors.grayLight};
  }
`;

const ScheduleCalendar: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { schedules, loading } = useSelector((state: RootState) => state.schedules);
  const [view, setView] = useState(Views.MONTH);
  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelectEvent = (event: Schedule) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: '',
      title: '',
      description: '',
      startDate: slotInfo.start,
      endDate: slotInfo.end,
      isAllDay: false,
      category: 'work',
      isShared: false,
      createdBy: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setShowForm(true);
  };

  const handleEventDrop = useCallback(
    async ({ event, start, end }: { event: Schedule; start: Date; end: Date }) => {
      await dispatch(
        updateSchedule({
          ...event,
          startDate: start,
          endDate: end,
        })
      );
    },
    [dispatch]
  );

  const handleEventResize = useCallback(
    async ({ event, start, end }: { event: Schedule; start: Date; end: Date }) => {
      await dispatch(
        updateSchedule({
          ...event,
          startDate: start,
          endDate: end,
        })
      );
    },
    [dispatch]
  );

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEvent(null);
  };

  const getEventStyle = (event: Schedule) => {
    const backgroundColor = {
      work: '#4f46e5',
      personal: '#10b981',
      education: '#f59e0b',
      health: '#ef4444',
    }[event.category];

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <>
      <CalendarContainer>
        <ToolbarContainer>
          <ViewButtons>
            <ViewButton active={view === Views.MONTH} onClick={() => setView(Views.MONTH)}>
              {t('calendar.month')}
            </ViewButton>
            <ViewButton active={view === Views.WEEK} onClick={() => setView(Views.WEEK)}>
              {t('calendar.week')}
            </ViewButton>
            <ViewButton active={view === Views.DAY} onClick={() => setView(Views.DAY)}>
              {t('calendar.day')}
            </ViewButton>
          </ViewButtons>
        </ToolbarContainer>

        <Calendar
          localizer={localizer}
          events={schedules}
          startAccessor="startDate"
          endAccessor="endDate"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          resizable
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          eventPropGetter={getEventStyle}
          messages={{
            next: t('calendar.next'),
            previous: t('calendar.previous'),
            today: t('calendar.today'),
            month: t('calendar.month'),
            week: t('calendar.week'),
            day: t('calendar.day'),
            agenda: t('calendar.agenda'),
            date: t('calendar.date'),
            time: t('calendar.time'),
            event: t('calendar.event'),
          }}
        />
      </CalendarContainer>

      {showForm && selectedEvent && (
        <ScheduleForm schedule={selectedEvent} onClose={handleCloseForm} />
      )}
    </>
  );
};

export default ScheduleCalendar;
