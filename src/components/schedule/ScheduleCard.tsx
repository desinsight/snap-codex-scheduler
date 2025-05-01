import React from 'react';
import styled, { css } from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';

interface ScheduleProps {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  onEdit?: () => void;
  onDelete?: () => void;
}

const PriorityBadge = styled.span<{ priority: ScheduleProps['priority'] }>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  
  ${({ priority, theme }) => {
    const variants = {
      high: css`
        background: ${theme.colors.gradient.danger};
        color: white;
      `,
      medium: css`
        background: ${theme.colors.gradient.primary};
        color: white;
      `,
      low: css`
        background: ${theme.colors.gradient.success};
        color: white;
      `,
    };
    return variants[priority];
  }}
`;

const StatusIndicator = styled.div<{ status: ScheduleProps['status'] }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    
    ${({ status, theme }) => {
      const colors = {
        pending: theme.colors.warning,
        'in-progress': theme.colors.primary,
        completed: theme.colors.success,
      };
      return css`
        background-color: ${colors[status]};
      `;
    }}
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  margin: ${({ theme }) => `${theme.space.sm} 0`};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`;

const ScheduleCard: React.FC<ScheduleProps> = ({
  title,
  description,
  startDate,
  endDate,
  priority,
  status,
  onEdit,
  onDelete,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const header = (
    <HeaderContent>
      <Title>{title}</Title>
      <PriorityBadge priority={priority}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </PriorityBadge>
    </HeaderContent>
  );

  const footer = (
    <Actions>
      <Button variant="outline" size="sm" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete}>
        Delete
      </Button>
    </Actions>
  );

  return (
    <Card
      variant="default"
      interactive
      header={header}
      footer={footer}
    >
      <Description>{description}</Description>
      <DateInfo>
        <span>From: {formatDate(startDate)}</span>
        <span>To: {formatDate(endDate)}</span>
      </DateInfo>
      <StatusIndicator status={status}>
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </StatusIndicator>
    </Card>
  );
};

export default ScheduleCard; 