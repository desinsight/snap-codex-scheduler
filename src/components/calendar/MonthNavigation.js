import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import Button from '../common/Button';
const NavigationContainer = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;
const MonthYearDisplay = styled.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;
const MonthYear = styled.h2 `
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 600;
  margin: 0;
`;
const NavigationButtons = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`;
const MonthNavigation = ({ currentDate, onPrevMonth, onNextMonth, onTodayClick, }) => {
    return (_jsxs(NavigationContainer, { children: [_jsxs(MonthYearDisplay, { children: [_jsx(MonthYear, { children: currentDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long' }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: onTodayClick, children: "\uC624\uB298" })] }), _jsxs(NavigationButtons, { children: [_jsx(Button, { variant: "ghost", onClick: onPrevMonth, children: "\u2190" }), _jsx(Button, { variant: "ghost", onClick: onNextMonth, children: "\u2192" })] })] }));
};
export default MonthNavigation;
