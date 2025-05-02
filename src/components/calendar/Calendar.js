import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import Button from '../Button/Button';
import Card from '../Card/Card';
const CalendarContainer = styled.div `
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;
const CalendarHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const CalendarTitle = styled.h1 `
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;
const CalendarActions = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;
const SearchBar = styled.div `
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  width: 300px;

  input {
    border: none;
    background: none;
    flex: 1;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    color: ${({ theme }) => theme.colors.text.primary};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;
const StyledCalendar = styled(FullCalendar) `
  .fc {
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: ${({ theme }) => theme.spacing.sm};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    padding: ${({ theme }) => theme.spacing.md};
  }

  .fc-header-toolbar {
    margin-bottom: ${({ theme }) => theme.spacing.md} !important;
  }

  .fc-button {
    background-color: ${({ theme }) => theme.colors.primary.main} !important;
    border: none !important;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`} !important;
    font-size: ${({ theme }) => theme.typography.button.fontSize} !important;
    font-weight: ${({ theme }) => theme.typography.button.fontWeight} !important;
    border-radius: ${({ theme }) => theme.spacing.xs} !important;
    transition: all ${({ theme }) => theme.transitions.duration.short}ms
      ${({ theme }) => theme.transitions.easing.easeInOut} !important;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary.dark} !important;
    }

    &:active {
      background-color: ${({ theme }) => theme.colors.primary.light} !important;
    }
  }

  .fc-event {
    border-radius: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.duration.short}ms
      ${({ theme }) => theme.transitions.easing.easeInOut};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }

  .fc-day-today {
    background-color: ${({ theme }) => theme.colors.primary.main}10 !important;
  }

  .fc-daygrid-day-number {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
  }

  .fc-col-header-cell {
    padding: ${({ theme }) => theme.spacing.sm} !important;
    background-color: ${({ theme }) => theme.colors.background.paper};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 500;
  }

  .fc-daygrid-day {
    border-color: ${({ theme }) => theme.colors.divider} !important;
  }
`;
const EventModal = styled(motion.div) `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;
const ModalOverlay = styled(motion.div) `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;
const Calendar = () => {
    const [events, setEvents] = useState([
        {
            id: '1',
            title: 'Team Meeting',
            start: new Date(2024, 4, 1, 10, 0),
            end: new Date(2024, 4, 1, 11, 0),
            color: '#2563EB',
        },
        {
            id: '2',
            title: 'Project Deadline',
            start: new Date(2024, 4, 5),
            end: new Date(2024, 4, 5),
            allDay: true,
            color: '#DC2626',
        },
    ]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleDateSelect = useCallback((selectInfo) => {
        const title = prompt('Please enter a title for your event');
        const calendarApi = selectInfo.view.calendar;
        if (title) {
            calendarApi.addEvent({
                id: String(Date.now()),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
        }
    }, []);
    const handleEventClick = useCallback((clickInfo) => {
        setSelectedEvent(clickInfo.event);
        setIsModalOpen(true);
    }, []);
    const handleEventDrop = useCallback((eventDropInfo) => {
        const { event } = eventDropInfo;
        setEvents(prev => prev.map(e => (e.id === event.id ? { ...e, start: event.start, end: event.end } : e)));
    }, []);
    return (_jsxs(CalendarContainer, { children: [_jsxs(CalendarHeader, { children: [_jsx(CalendarTitle, { children: "Calendar" }), _jsxs(CalendarActions, { children: [_jsxs(SearchBar, { children: [_jsx(FiSearch, {}), _jsx("input", { type: "text", placeholder: "Search events..." })] }), _jsx(Button, { variant: "outlined", color: "primary", startIcon: _jsx(FiFilter, {}), children: "Filter" }), _jsx(Button, { color: "primary", startIcon: _jsx(FiPlus, {}), children: "New Event" })] })] }), _jsx(Card, { elevation: "md", padding: "md", children: _jsx(StyledCalendar, { plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }, initialView: "dayGridMonth", editable: true, selectable: true, selectMirror: true, dayMaxEvents: true, weekends: true, events: events, select: handleDateSelect, eventClick: handleEventClick, eventDrop: handleEventDrop }) }), _jsx(AnimatePresence, { children: isModalOpen && (_jsxs(_Fragment, { children: [_jsx(ModalOverlay, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsModalOpen(false) }), _jsx(EventModal, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, children: _jsxs(Card, { children: [_jsx(Card.Header, { children: _jsx("h2", { children: selectedEvent?.title }) }), _jsxs(Card.Content, { children: [_jsxs("p", { children: ["Start: ", selectedEvent?.start?.toLocaleString()] }), _jsxs("p", { children: ["End: ", selectedEvent?.end?.toLocaleString()] })] }), _jsx(Card.Footer, { children: _jsx(Button, { color: "error", onClick: () => {
                                                if (selectedEvent) {
                                                    setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
                                                    setIsModalOpen(false);
                                                }
                                            }, children: "Delete Event" }) })] }) })] })) })] }));
};
export default Calendar;
