import React from 'react';
import styled from 'styled-components';
import { CalendarEvent } from './CalendarView';
import Button from '../common/Button';
import { Theme } from '../../types/theme';

interface EventPopoverProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PopoverContainer = styled.div<{ theme: Theme }>`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.md};
  min-width: 200px;
  z-index: 1000;
`;

const EventTitle = styled.h3<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EventDetails = styled.div<{ theme: Theme }>`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div<{ theme: Theme }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const EventPopover: React.FC<EventPopoverProps> = ({ event, onClose, onEdit, onDelete }) => {
  return (
    <PopoverContainer>
      <EventTitle>{event.title}</EventTitle>
      <EventDetails>
        <div>Start: {event.start.toLocaleString()}</div>
        <div>End: {event.end.toLocaleString()}</div>
        {event.description && <div>{event.description}</div>}
        {event.location && <div>Location: {event.location}</div>}
      </EventDetails>
      <ButtonGroup>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        {onEdit && (
          <Button color="primary" onClick={onEdit}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button color="error" onClick={onDelete}>
            Delete
          </Button>
        )}
      </ButtonGroup>
    </PopoverContainer>
  );
};

export default EventPopover;
