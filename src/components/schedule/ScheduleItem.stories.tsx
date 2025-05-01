import React from 'react';
import { Story, Meta } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import ScheduleItem from './ScheduleItem';
import { Schedule, ScheduleCategory } from '../../types/schedule';

export default {
  title: 'Components/Schedule/ScheduleItem',
  component: ScheduleItem,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    ),
  ],
} as Meta;

const Template: Story<{ schedule: Schedule }> = (args) => <ScheduleItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  schedule: {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync meeting',
    startDate: new Date('2024-03-20T10:00:00'),
    endDate: new Date('2024-03-20T11:00:00'),
    isAllDay: false,
    category: ScheduleCategory.WORK,
    isShared: true,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const AllDayEvent = Template.bind({});
AllDayEvent.args = {
  schedule: {
    id: '2',
    title: 'Company Holiday',
    description: 'Company-wide holiday',
    startDate: new Date('2024-03-21T00:00:00'),
    endDate: new Date('2024-03-21T23:59:59'),
    isAllDay: true,
    category: ScheduleCategory.PERSONAL,
    isShared: true,
    createdBy: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const PrivateEvent = Template.bind({});
PrivateEvent.args = {
  schedule: {
    id: '3',
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    startDate: new Date('2024-03-22T14:00:00'),
    endDate: new Date('2024-03-22T15:00:00'),
    isAllDay: false,
    category: ScheduleCategory.HEALTH,
    isShared: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const EducationEvent = Template.bind({});
EducationEvent.args = {
  schedule: {
    id: '4',
    title: 'Online Course',
    description: 'React Advanced Patterns',
    startDate: new Date('2024-03-23T19:00:00'),
    endDate: new Date('2024-03-23T21:00:00'),
    isAllDay: false,
    category: ScheduleCategory.EDUCATION,
    isShared: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const NoDescription = Template.bind({});
NoDescription.args = {
  schedule: {
    id: '5',
    title: 'Quick Call',
    description: undefined,
    startDate: new Date('2024-03-24T16:00:00'),
    endDate: new Date('2024-03-24T16:30:00'),
    isAllDay: false,
    category: ScheduleCategory.WORK,
    isShared: false,
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}; 