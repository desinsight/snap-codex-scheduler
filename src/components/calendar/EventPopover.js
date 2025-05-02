import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import Button from '../common/Button';
const PopoverContainer = styled.div `
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
const EventTitle = styled.h3 `
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;
const EventDetails = styled.div `
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;
const EventPopover = ({ event, onClose, onEdit, onDelete }) => {
    return (_jsxs(PopoverContainer, { children: [_jsx(EventTitle, { children: event.title }), _jsxs(EventDetails, { children: [_jsxs("div", { children: ["Start: ", event.start.toLocaleString()] }), _jsxs("div", { children: ["End: ", event.end.toLocaleString()] }), event.description && _jsx("div", { children: event.description }), event.location && _jsxs("div", { children: ["Location: ", event.location] })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { variant: "outlined", onClick: onClose, children: "Close" }), onEdit && (_jsx(Button, { color: "primary", onClick: onEdit, children: "Edit" })), onDelete && (_jsx(Button, { color: "error", onClick: onDelete, children: "Delete" }))] })] }));
};
export default EventPopover;
