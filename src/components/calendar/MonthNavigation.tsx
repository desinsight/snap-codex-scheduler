import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

interface MonthNavigationProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
}

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const MonthYearDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const MonthYear = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 600;
  margin: 0;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
`;

const MonthNavigation: React.FC<MonthNavigationProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onTodayClick,
}) => {
  return (
    <NavigationContainer>
      <MonthYearDisplay>
        <MonthYear>
          {currentDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long' })}
        </MonthYear>
        <Button variant="outline" size="sm" onClick={onTodayClick}>
          오늘
        </Button>
      </MonthYearDisplay>
      
      <NavigationButtons>
        <Button variant="ghost" onClick={onPrevMonth}>
          ←
        </Button>
        <Button variant="ghost" onClick={onNextMonth}>
          →
        </Button>
      </NavigationButtons>
    </NavigationContainer>
  );
};

export default MonthNavigation; 