import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchSchedules, setFilter } from '../../store/slices/scheduleSlice';
import ScheduleItem from './ScheduleItem';
import ScheduleFilter from './ScheduleFilter';
import LoadingSpinner from '../LoadingSpinner';
const ScheduleListContainer = styled.div `
  padding: 1rem;
`;
const ScheduleListHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
const ScheduleListTitle = styled.h2 `
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;
const ScheduleListContent = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;
const ErrorMessage = styled.div `
  color: #dc3545;
  padding: 1rem;
  background-color: #f8d7da;
  border-radius: 4px;
  margin-bottom: 1rem;
`;
const EmptyMessage = styled.div `
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;
const ScheduleList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { schedules, loading, error, filter } = useSelector((state) => state.schedules);
    useEffect(() => {
        dispatch(fetchSchedules(filter));
    }, [dispatch, filter]);
    const handleFilterChange = (newFilter) => {
        dispatch(setFilter(newFilter));
    };
    if (loading) {
        return _jsx(LoadingSpinner, {});
    }
    if (error) {
        return _jsx(ErrorMessage, { children: error });
    }
    return (_jsxs(ScheduleListContainer, { children: [_jsxs(ScheduleListHeader, { children: [_jsx(ScheduleListTitle, { children: t('schedule.list.title') }), _jsx(ScheduleFilter, { onFilterChange: handleFilterChange })] }), schedules.length === 0 ? (_jsx(EmptyMessage, { children: t('schedule.list.empty') })) : (_jsx(ScheduleListContent, { children: schedules.map(schedule => (_jsx(ScheduleItem, { schedule: schedule }, schedule.id))) }))] }));
};
export default ScheduleList;
