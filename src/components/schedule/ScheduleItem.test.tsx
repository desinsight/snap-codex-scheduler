import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import ScheduleItem from './ScheduleItem';
import { Schedule, ScheduleCategory } from '../../types/schedule';

const mockSchedule: Schedule = {
  id: '1',
  title: 'Test Schedule',
  description: 'This is a test schedule',
  startDate: new Date('2024-03-20T10:00:00'),
  endDate: new Date('2024-03-20T12:00:00'),
  isAllDay: false,
  category: ScheduleCategory.WORK,
  isShared: true,
  createdBy: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ScheduleItem', () => {
  const renderComponent = (schedule: Schedule) => {
    return render(
      <I18nextProvider i18n={i18n}>
        <ScheduleItem schedule={schedule} />
      </I18nextProvider>
    );
  };

  it('renders schedule title', () => {
    renderComponent(mockSchedule);
    expect(screen.getByText('Test Schedule')).toBeInTheDocument();
  });

  it('renders schedule description', () => {
    renderComponent(mockSchedule);
    expect(screen.getByText('This is a test schedule')).toBeInTheDocument();
  });

  it('renders schedule time correctly', () => {
    renderComponent(mockSchedule);
    expect(screen.getByText(/Mar 20, 2024/)).toBeInTheDocument();
  });

  it('renders category badge', () => {
    renderComponent(mockSchedule);
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('renders shared badge when schedule is shared', () => {
    renderComponent(mockSchedule);
    expect(screen.getByText('Shared')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderComponent(mockSchedule);
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders all-day text when schedule is all day', () => {
    const allDaySchedule = { ...mockSchedule, isAllDay: true };
    renderComponent(allDaySchedule);
    expect(screen.getByText('All Day')).toBeInTheDocument();
  });

  it('does not render description when it is not provided', () => {
    const scheduleWithoutDescription = { ...mockSchedule, description: undefined };
    renderComponent(scheduleWithoutDescription);
    expect(screen.queryByText('This is a test schedule')).not.toBeInTheDocument();
  });

  it('does not render shared badge when schedule is not shared', () => {
    const privateSchedule = { ...mockSchedule, isShared: false };
    renderComponent(privateSchedule);
    expect(screen.queryByText('Shared')).not.toBeInTheDocument();
  });
}); 