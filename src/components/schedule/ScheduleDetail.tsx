import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RootState } from '../../store';
import { fetchScheduleById } from '../../store/slices/scheduleSlice';
import { Schedule } from '../../types/schedule';
import NotificationSettings from './NotificationSettings';
import NotificationHistory from '../NotificationHistory';

// ... existing styled components ...

const Tabs = styled.div`
  display: flex;
  margin: 20px 0;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? '#4f46e5' : 'transparent')};
  color: ${({ active }) => (active ? '#4f46e5' : '#666')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

  &:hover {
    color: #4f46e5;
  }
`;

const TabContent = styled.div`
  margin-top: 20px;
`;

const ScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { schedule, loading, error } = useSelector((state: RootState) => state.schedules);
  const [activeTab, setActiveTab] = React.useState<'details' | 'notifications' | 'history'>(
    'details'
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchScheduleById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!schedule) {
    return <div>{t('notFound')}</div>;
  }

  const handleDelete = async () => {
    if (window.confirm(t('deleteConfirm'))) {
      await dispatch(deleteSchedule(schedule.id));
      navigate('/schedules');
    }
  };

  return (
    <Container>
      <Header>
        <Title>{schedule.title}</Title>
        <CategoryBadge category={schedule.category}>
          {t(`categories.${schedule.category}`)}
        </CategoryBadge>
      </Header>

      <Content>
        <Description>{schedule.description}</Description>
        <TimeDisplay>
          {schedule.isAllDay ? (
            t('allDay')
          ) : (
            <>
              {new Date(schedule.startDate).toLocaleString()} -{' '}
              {new Date(schedule.endDate).toLocaleString()}
            </>
          )}
        </TimeDisplay>
      </Content>

      <Tabs>
        <Tab active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
          {t('details')}
        </Tab>
        <Tab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
          {t('notifications.title')}
        </Tab>
        <Tab active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          {t('notifications.history.title')}
        </Tab>
      </Tabs>

      <TabContent>
        {activeTab === 'details' && (
          <Footer>
            <Button onClick={() => navigate(`/schedules/${schedule.id}/edit`)}>{t('edit')}</Button>
            <Button onClick={() => navigate(`/schedules/${schedule.id}/share`)}>
              {t('share')}
            </Button>
            <Button onClick={handleDelete} danger>
              {t('delete')}
            </Button>
          </Footer>
        )}
        {activeTab === 'notifications' && <NotificationSettings scheduleId={schedule.id} />}
        {activeTab === 'history' && <NotificationHistory scheduleId={schedule.id} />}
      </TabContent>
    </Container>
  );
};

export default ScheduleDetail;
