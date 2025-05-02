import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Button from '../Button/Button';
import Card from '../Card/Card';
import ScheduleForm from './ScheduleForm';
const ScheduleContainer = styled.div `
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;
const ScheduleHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;
const ScheduleTitle = styled.h1 `
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;
const ScheduleGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;
const ScheduleCard = styled(motion.div) `
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.short}ms
    ${({ theme }) => theme.transitions.easing.easeInOut};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;
const ScheduleInfo = styled.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  margin: ${({ theme }) => theme.spacing.xs} 0;

  svg {
    font-size: 16px;
  }
`;
const PriorityBadge = styled.span `
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  text-transform: capitalize;

  ${({ theme, priority }) => {
    const colors = {
        high: theme.colors.error.main,
        medium: theme.colors.warning.main,
        low: theme.colors.success.main,
    };
    return `
      background-color: ${colors[priority]}20;
      color: ${colors[priority]};
    `;
}}
`;
const StatusBadge = styled.span `
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  text-transform: capitalize;
  margin-left: ${({ theme }) => theme.spacing.sm};

  ${({ theme, status }) => {
    const colors = {
        upcoming: theme.colors.info.main,
        ongoing: theme.colors.primary.main,
        completed: theme.colors.success.main,
        cancelled: theme.colors.error.main,
    };
    return `
      background-color: ${colors[status]}20;
      color: ${colors[status]};
    `;
}}
`;
const ParticipantsList = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;
const ParticipantAvatar = styled.div `
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
`;
const ScheduleModal = styled(motion.div) `
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
  max-width: 600px;
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
const Schedule = () => {
    const [schedules, setSchedules] = useState([
        {
            id: '1',
            title: 'Team Planning Meeting',
            description: 'Monthly team planning meeting to discuss upcoming projects and goals.',
            startDate: new Date(2024, 4, 15, 10, 0),
            endDate: new Date(2024, 4, 15, 12, 0),
            location: 'Conference Room A',
            participants: ['John', 'Sarah', 'Mike', 'Emma'],
            priority: 'high',
            status: 'upcoming',
        },
        {
            id: '2',
            title: 'Client Presentation',
            description: 'Present the new product features to the client.',
            startDate: new Date(2024, 4, 16, 14, 0),
            endDate: new Date(2024, 4, 16, 15, 30),
            location: 'Virtual Meeting',
            participants: ['Sarah', 'Mike'],
            priority: 'medium',
            status: 'upcoming',
        },
        {
            id: '3',
            title: 'Project Deadline',
            description: 'Submit the final project deliverables.',
            startDate: new Date(2024, 4, 20),
            endDate: new Date(2024, 4, 20),
            priority: 'high',
            status: 'upcoming',
        },
    ]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const handleScheduleClick = (schedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };
    const handleCreateSchedule = () => {
        setSelectedSchedule(null);
        setIsFormOpen(true);
    };
    const handleEditSchedule = (schedule) => {
        setSelectedSchedule(schedule);
        setIsFormOpen(true);
        setIsModalOpen(false);
    };
    const handleFormSubmit = (formData) => {
        if (selectedSchedule) {
            // Edit existing schedule
            setSchedules(prev => prev.map(s => (s.id === selectedSchedule.id ? { ...formData, id: selectedSchedule.id } : s)));
        }
        else {
            // Create new schedule
            setSchedules(prev => [
                ...prev,
                {
                    ...formData,
                    id: String(Date.now()), // Simple ID generation
                },
            ]);
        }
        setIsFormOpen(false);
    };
    const handleFormCancel = () => {
        setIsFormOpen(false);
        setSelectedSchedule(null);
    };
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };
    if (isFormOpen) {
        return (_jsx(ScheduleForm, { schedule: selectedSchedule || undefined, onSubmit: handleFormSubmit, onCancel: handleFormCancel }));
    }
    return (_jsxs(ScheduleContainer, { children: [_jsxs(ScheduleHeader, { children: [_jsx(ScheduleTitle, { children: "Schedules" }), _jsx(Button, { color: "primary", startIcon: _jsx(FiPlus, {}), onClick: handleCreateSchedule, children: "New Schedule" })] }), _jsx(ScheduleGrid, { children: schedules.map(schedule => (_jsx(ScheduleCard, { onClick: () => handleScheduleClick(schedule), initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 }, children: _jsxs(Card, { children: [_jsx(Card.Header, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h3", { children: schedule.title }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx(PriorityBadge, { priority: schedule.priority, children: schedule.priority }), _jsx(StatusBadge, { status: schedule.status, children: schedule.status })] })] }) }), _jsxs(Card.Content, { children: [_jsx("p", { children: schedule.description }), _jsxs(ScheduleInfo, { children: [_jsx(FiCalendar, {}), formatDate(schedule.startDate), " - ", formatDate(schedule.endDate)] }), schedule.location && (_jsxs(ScheduleInfo, { children: [_jsx(FiMapPin, {}), schedule.location] })), schedule.participants && (_jsxs(ParticipantsList, { children: [_jsx(FiUsers, {}), schedule.participants.map((participant, index) => (_jsx(ParticipantAvatar, { children: getInitials(participant) }, index)))] }))] }), _jsx(Card.Footer, { children: _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx(Button, { variant: "text", color: "primary", size: "small", startIcon: _jsx(FiEdit2, {}), onClick: e => {
                                                e.stopPropagation();
                                                handleEditSchedule(schedule);
                                            }, children: "Edit" }), _jsx(Button, { variant: "text", color: "error", size: "small", startIcon: _jsx(FiTrash2, {}), onClick: e => {
                                                e.stopPropagation();
                                                setSchedules(prev => prev.filter(s => s.id !== schedule.id));
                                            }, children: "Delete" })] }) })] }) }, schedule.id))) }), _jsx(AnimatePresence, { children: isModalOpen && selectedSchedule && (_jsxs(_Fragment, { children: [_jsx(ModalOverlay, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: () => setIsModalOpen(false) }), _jsx(ScheduleModal, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, children: _jsxs(Card, { children: [_jsx(Card.Header, { children: _jsxs("div", { style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }, children: [_jsx("h2", { children: selectedSchedule.title }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx(PriorityBadge, { priority: selectedSchedule.priority, children: selectedSchedule.priority }), _jsx(StatusBadge, { status: selectedSchedule.status, children: selectedSchedule.status })] })] }) }), _jsxs(Card.Content, { children: [_jsx("p", { children: selectedSchedule.description }), _jsxs(ScheduleInfo, { children: [_jsx(FiCalendar, {}), formatDate(selectedSchedule.startDate), " -", ' ', formatDate(selectedSchedule.endDate)] }), selectedSchedule.location && (_jsxs(ScheduleInfo, { children: [_jsx(FiMapPin, {}), selectedSchedule.location] })), selectedSchedule.participants && (_jsxs(ParticipantsList, { children: [_jsx(FiUsers, {}), selectedSchedule.participants.map((participant, index) => (_jsx(ParticipantAvatar, { children: getInitials(participant) }, index)))] }))] }), _jsx(Card.Footer, { children: _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx(Button, { color: "primary", startIcon: _jsx(FiEdit2, {}), onClick: () => handleEditSchedule(selectedSchedule), children: "Edit Schedule" }), _jsx(Button, { color: "error", startIcon: _jsx(FiTrash2, {}), onClick: () => {
                                                        setSchedules(prev => prev.filter(s => s.id !== selectedSchedule.id));
                                                        setIsModalOpen(false);
                                                    }, children: "Delete Schedule" })] }) })] }) })] })) })] }));
};
export default Schedule;
