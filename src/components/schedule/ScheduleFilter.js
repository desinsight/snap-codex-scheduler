import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ScheduleCategory } from '../../types/schedule';
const FilterContainer = styled.div `
  display: flex;
  gap: 1rem;
  align-items: center;
`;
const FilterInput = styled.input `
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;
const FilterSelect = styled.select `
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
`;
const FilterLabel = styled.label `
  font-size: 0.9rem;
  color: #666;
  margin-right: 0.5rem;
`;
const ScheduleFilter = ({ onFilterChange }) => {
    const { t } = useTranslation();
    const handleSearchChange = (e) => {
        onFilterChange({ title: e.target.value });
    };
    const handleCategoryChange = (e) => {
        onFilterChange({ category: e.target.value });
    };
    const handleSharedChange = (e) => {
        onFilterChange({ isShared: e.target.value === 'true' });
    };
    return (_jsxs(FilterContainer, { children: [_jsx(FilterLabel, { children: t('schedule.filter.search') }), _jsx(FilterInput, { type: "text", placeholder: t('schedule.filter.searchPlaceholder'), onChange: handleSearchChange }), _jsx(FilterLabel, { children: t('schedule.filter.category') }), _jsxs(FilterSelect, { onChange: handleCategoryChange, children: [_jsx("option", { value: "", children: t('schedule.filter.allCategories') }), Object.values(ScheduleCategory).map(category => (_jsx("option", { value: category, children: t(`schedule.category.${category.toLowerCase()}`) }, category)))] }), _jsx(FilterLabel, { children: t('schedule.filter.shared') }), _jsxs(FilterSelect, { onChange: handleSharedChange, children: [_jsx("option", { value: "", children: t('schedule.filter.all') }), _jsx("option", { value: "true", children: t('schedule.filter.shared') }), _jsx("option", { value: "false", children: t('schedule.filter.notShared') })] })] }));
};
export default ScheduleFilter;
