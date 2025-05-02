import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styled from 'styled-components';
const FiltersContainer = styled.div `
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;
const SearchBar = styled.div `
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  width: 300px;

  input {
    border: none;
    background: none;
    flex: 1;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    color: ${({ theme }) => theme.colors.text.primary};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;
const FilterGroup = styled.div `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;
const FilterLabel = styled.span `
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
const FilterSelect = styled.select `
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;
const FilterChip = styled.div `
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ active, theme }) => active ? theme.colors.background.paper : theme.colors.text.primary};
  background: ${({ active, theme }) => active ? theme.colors.primary.main : `${theme.colors.text.tertiary}20`};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.short}ms
    ${({ theme }) => theme.transitions.easing.easeInOut};

  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primary.dark : `${theme.colors.text.tertiary}40`};
  }
`;
const CalendarFilters = ({ onSearch, onFilterChange, onSortChange, }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filters, setFilters] = React.useState({
        categories: [],
        priority: [],
        status: [],
        dateRange: {
            start: null,
            end: null,
        },
    });
    const [sortOption, setSortOption] = React.useState('date-asc');
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };
    const handleFilterChange = (type, value) => {
        const newFilters = { ...filters };
        const array = newFilters[type];
        if (array.includes(value)) {
            array.splice(array.indexOf(value), 1);
        }
        else {
            array.push(value);
        }
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
        onSortChange(value);
    };
    return (_jsxs(FiltersContainer, { theme: theme, children: [_jsx(SearchBar, { theme: theme, children: _jsx("input", { type: "text", placeholder: "\uC77C\uC815 \uAC80\uC0C9...", value: searchQuery, onChange: handleSearchChange }) }), _jsxs(FilterGroup, { children: [_jsx(FilterLabel, { children: "\uCE74\uD14C\uACE0\uB9AC:" }), _jsx(FilterChip, { active: filters.categories.includes('meeting'), onClick: () => handleFilterChange('categories', 'meeting'), children: "\uD68C\uC758" }), _jsx(FilterChip, { active: filters.categories.includes('task'), onClick: () => handleFilterChange('categories', 'task'), children: "\uC5C5\uBB34" }), _jsx(FilterChip, { active: filters.categories.includes('deadline'), onClick: () => handleFilterChange('categories', 'deadline'), children: "\uB9C8\uAC10\uC77C" })] }), _jsxs(FilterGroup, { children: [_jsx(FilterLabel, { children: "\uC6B0\uC120\uC21C\uC704:" }), _jsx(FilterChip, { active: filters.priority.includes('high'), onClick: () => handleFilterChange('priority', 'high'), children: "\uB192\uC74C" }), _jsx(FilterChip, { active: filters.priority.includes('medium'), onClick: () => handleFilterChange('priority', 'medium'), children: "\uC911\uAC04" }), _jsx(FilterChip, { active: filters.priority.includes('low'), onClick: () => handleFilterChange('priority', 'low'), children: "\uB0AE\uC74C" })] }), _jsxs(FilterGroup, { children: [_jsx(FilterLabel, { children: "\uC815\uB82C:" }), _jsxs(FilterSelect, { value: sortOption, onChange: handleSortChange, children: [_jsx("option", { value: "date-asc", children: "\uB0A0\uC9DC \uC624\uB984\uCC28\uC21C" }), _jsx("option", { value: "date-desc", children: "\uB0A0\uC9DC \uB0B4\uB9BC\uCC28\uC21C" }), _jsx("option", { value: "priority", children: "\uC6B0\uC120\uC21C\uC704\uC21C" }), _jsx("option", { value: "status", children: "\uC0C1\uD0DC\uC21C" })] })] })] }));
};
export default CalendarFilters;
