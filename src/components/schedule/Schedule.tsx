import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Button from '../Button/Button';
import Card from '../Card/Card';
import ScheduleForm from './ScheduleForm';

interface Schedule {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  participants?: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const ScheduleContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ScheduleTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ScheduleCard = styled(motion.div)`
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

const ScheduleInfo = styled.div`
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

const PriorityBadge = styled.span<{ priority: Schedule['priority'] }>`
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

const StatusBadge = styled.span<{ status: Schedule['status'] }>`
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

const ParticipantsList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ParticipantAvatar = styled.div`
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

const ScheduleModal = styled(motion.div)`
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([
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

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setIsFormOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsFormOpen(true);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (formData: Omit<Schedule, 'id'>) => {
    if (selectedSchedule) {
      // Edit existing schedule
      setSchedules(prev =>
        prev.map(s => (s.id === selectedSchedule.id ? { ...formData, id: selectedSchedule.id } : s))
      );
    } else {
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isFormOpen) {
    return (
      <ScheduleForm
        schedule={selectedSchedule || undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <ScheduleContainer>
      <ScheduleHeader>
        <ScheduleTitle>Schedules</ScheduleTitle>
        <Button color="primary" startIcon={<FiPlus />} onClick={handleCreateSchedule}>
          New Schedule
        </Button>
      </ScheduleHeader>

      <ScheduleGrid>
        {schedules.map(schedule => (
          <ScheduleCard
            key={schedule.id}
            onClick={() => handleScheduleClick(schedule)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <Card.Header>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <h3>{schedule.title}</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <PriorityBadge priority={schedule.priority}>{schedule.priority}</PriorityBadge>
                    <StatusBadge status={schedule.status}>{schedule.status}</StatusBadge>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <p>{schedule.description}</p>
                <ScheduleInfo>
                  <FiCalendar />
                  {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                </ScheduleInfo>
                {schedule.location && (
                  <ScheduleInfo>
                    <FiMapPin />
                    {schedule.location}
                  </ScheduleInfo>
                )}
                {schedule.participants && (
                  <ParticipantsList>
                    <FiUsers />
                    {schedule.participants.map((participant, index) => (
                      <ParticipantAvatar key={index}>{getInitials(participant)}</ParticipantAvatar>
                    ))}
                  </ParticipantsList>
                )}
              </Card.Content>
              <Card.Footer>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    startIcon={<FiEdit2 />}
                    onClick={e => {
                      e.stopPropagation();
                      handleEditSchedule(schedule);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    startIcon={<FiTrash2 />}
                    onClick={e => {
                      e.stopPropagation();
                      setSchedules(prev => prev.filter(s => s.id !== schedule.id));
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </ScheduleCard>
        ))}
      </ScheduleGrid>

      <AnimatePresence>
        {isModalOpen && selectedSchedule && (
          <>
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            <ScheduleModal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card>
                <Card.Header>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h2>{selectedSchedule.title}</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <PriorityBadge priority={selectedSchedule.priority}>
                        {selectedSchedule.priority}
                      </PriorityBadge>
                      <StatusBadge status={selectedSchedule.status}>
                        {selectedSchedule.status}
                      </StatusBadge>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p>{selectedSchedule.description}</p>
                  <ScheduleInfo>
                    <FiCalendar />
                    {formatDate(selectedSchedule.startDate)} -{' '}
                    {formatDate(selectedSchedule.endDate)}
                  </ScheduleInfo>
                  {selectedSchedule.location && (
                    <ScheduleInfo>
                      <FiMapPin />
                      {selectedSchedule.location}
                    </ScheduleInfo>
                  )}
                  {selectedSchedule.participants && (
                    <ParticipantsList>
                      <FiUsers />
                      {selectedSchedule.participants.map((participant, index) => (
                        <ParticipantAvatar key={index}>
                          {getInitials(participant)}
                        </ParticipantAvatar>
                      ))}
                    </ParticipantsList>
                  )}
                </Card.Content>
                <Card.Footer>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      color="primary"
                      startIcon={<FiEdit2 />}
                      onClick={() => handleEditSchedule(selectedSchedule)}
                    >
                      Edit Schedule
                    </Button>
                    <Button
                      color="error"
                      startIcon={<FiTrash2 />}
                      onClick={() => {
                        setSchedules(prev => prev.filter(s => s.id !== selectedSchedule.id));
                        setIsModalOpen(false);
                      }}
                    >
                      Delete Schedule
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </ScheduleModal>
          </>
        )}
      </AnimatePresence>
    </ScheduleContainer>
  );
};

export default Schedule;
