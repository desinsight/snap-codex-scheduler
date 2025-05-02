import { jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
const EventContainer = styled.div `
  font-size: ${({ theme }) => theme.fontSizes.xs};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ color }) => color || 'transparent'}15;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  cursor: move;
  margin: 1px 0;
  position: relative;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};

  ${({ isMultiDay, theme }) => isMultiDay &&
    css `
      margin-left: -${theme.space.xs};
      margin-right: -${theme.space.xs};
      border-radius: 0;

      &:first-of-type {
        border-top-left-radius: ${theme.radii.sm};
        border-bottom-left-radius: ${theme.radii.sm};
      }

      &:last-of-type {
        border-top-right-radius: ${theme.radii.sm};
        border-bottom-right-radius: ${theme.radii.sm};
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
const DraggableEvent = ({ event, onClick, isStart, isEnd }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'EVENT',
        item: { event },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    }));
    const color = event.color || getCategoryColor(event.category);
    return (_jsxs(EventContainer, { ref: drag, color: color, isMultiDay: event.isMultiDay, isDragging: isDragging, onClick: onClick, children: [isStart && event.startTime && `${event.startTime} `, event.title] }));
};
export default DraggableEvent;
