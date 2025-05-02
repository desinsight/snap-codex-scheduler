import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
const PriorityBadge = styled.span `
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;

  ${({ priority, theme }) => {
    const variants = {
        high: css `
        background: ${theme.colors.gradient.danger};
        color: white;
      `,
        medium: css `
        background: ${theme.colors.gradient.primary};
        color: white;
      `,
        low: css `
        background: ${theme.colors.gradient.success};
        color: white;
      `,
    };
    return variants[priority];
}}
`;
const StatusIndicator = styled.div `
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
    return css `
        background-color: ${colors[status]};
      `;
}}
  }
`;
const HeaderContent = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
`;
const Title = styled.h3 `
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;
const Description = styled.p `
  margin: ${({ theme }) => `${theme.space.sm} 0`};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
const DateInfo = styled.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
const Actions = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`;
const ScheduleCard = ({ title, description, startDate, endDate, priority, status, onEdit, onDelete, }) => {
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(date);
    };
    const header = (_jsxs(HeaderContent, { children: [_jsx(Title, { children: title }), _jsx(PriorityBadge, { priority: priority, children: priority.charAt(0).toUpperCase() + priority.slice(1) })] }));
    const footer = (_jsxs(Actions, { children: [_jsx(Button, { variant: "outline", size: "sm", onClick: onEdit, children: "Edit" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onDelete, children: "Delete" })] }));
    return (_jsxs(Card, { variant: "default", interactive: true, header: header, footer: footer, children: [_jsx(Description, { children: description }), _jsxs(DateInfo, { children: [_jsxs("span", { children: ["From: ", formatDate(startDate)] }), _jsxs("span", { children: ["To: ", formatDate(endDate)] })] }), _jsx(StatusIndicator, { status: status, children: status
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ') })] }));
};
export default ScheduleCard;
