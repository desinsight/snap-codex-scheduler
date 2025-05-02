import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchScheduleById } from '../../store/slices/scheduleSlice';
import NotificationSettings from './NotificationSettings';
import NotificationHistory from '../NotificationHistory';
// ... existing styled components ...
const Tabs = styled.div `
  display: flex;
  margin: 20px 0;
  border-bottom: 1px solid #eee;
`;
const Tab = styled.button `
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
const TabContent = styled.div `
  margin-top: 20px;
`;
const ScheduleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation('schedule');
    const { schedule, loading, error } = useSelector((state) => state.schedules);
    const [activeTab, setActiveTab] = React.useState('details');
    useEffect(() => {
        if (id) {
            dispatch(fetchScheduleById(id));
        }
    }, [dispatch, id]);
    if (loading) {
        return _jsx("div", { children: t('loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    if (!schedule) {
        return _jsx("div", { children: t('notFound') });
    }
    const handleDelete = async () => {
        if (window.confirm(t('deleteConfirm'))) {
            await dispatch(deleteSchedule(schedule.id));
            navigate('/schedules');
        }
    };
    return (_jsxs(Container, { children: [_jsxs(Header, { children: [_jsx(Title, { children: schedule.title }), _jsx(CategoryBadge, { category: schedule.category, children: t(`categories.${schedule.category}`) })] }), _jsxs(Content, { children: [_jsx(Description, { children: schedule.description }), _jsx(TimeDisplay, { children: schedule.isAllDay ? (t('allDay')) : (_jsxs(_Fragment, { children: [new Date(schedule.startDate).toLocaleString(), " -", ' ', new Date(schedule.endDate).toLocaleString()] })) })] }), _jsxs(Tabs, { children: [_jsx(Tab, { active: activeTab === 'details', onClick: () => setActiveTab('details'), children: t('details') }), _jsx(Tab, { active: activeTab === 'notifications', onClick: () => setActiveTab('notifications'), children: t('notifications.title') }), _jsx(Tab, { active: activeTab === 'history', onClick: () => setActiveTab('history'), children: t('notifications.history.title') })] }), _jsxs(TabContent, { children: [activeTab === 'details' && (_jsxs(Footer, { children: [_jsx(Button, { onClick: () => navigate(`/schedules/${schedule.id}/edit`), children: t('edit') }), _jsx(Button, { onClick: () => navigate(`/schedules/${schedule.id}/share`), children: t('share') }), _jsx(Button, { onClick: handleDelete, danger: true, children: t('delete') })] })), activeTab === 'notifications' && _jsx(NotificationSettings, { scheduleId: schedule.id }), activeTab === 'history' && _jsx(NotificationHistory, { scheduleId: schedule.id })] })] }));
};
export default ScheduleDetail;
