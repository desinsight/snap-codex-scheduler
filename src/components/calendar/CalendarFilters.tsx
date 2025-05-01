import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { Theme } from '../../types/theme';

type SortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc' | 'priority-asc' | 'priority-desc';

interface CalendarFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: CalendarFilters) => void;
  onSortChange: (sort: SortOption) => void;
}

export interface CalendarFilters {
  categories: string[];
  priority: string[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

const FiltersContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SearchBar = styled.div<{ theme: Theme }>`
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

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const FilterLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FilterSelect = styled.select`
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

const FilterChip = styled.div<{ active?: boolean; theme: Theme }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ active, theme }) =>
    active ? theme.colors.background.paper : theme.colors.text.primary};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary.main : `${theme.colors.text.tertiary}20`};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.short}ms ${({ theme }) => theme.transitions.easing.easeInOut};

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary.dark : `${theme.colors.text.tertiary}40`};
  }
`;

const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  onSearch,
  onFilterChange,
  onSortChange,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<CalendarFilters>({
    categories: [],
    priority: [],
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [sortOption, setSortOption] = React.useState<SortOption>('date-asc');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (type: keyof CalendarFilters, value: string) => {
    const newFilters = { ...filters };
    const array = newFilters[type] as string[];
    
    if (array.includes(value)) {
      array.splice(array.indexOf(value), 1);
    } else {
      array.push(value);
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOption;
    setSortOption(value);
    onSortChange(value);
  };

  return (
    <FiltersContainer theme={theme}>
      <SearchBar theme={theme}>
        <input
          type="text"
          placeholder="일정 검색..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </SearchBar>

      <FilterGroup>
        <FilterLabel>카테고리:</FilterLabel>
        <FilterChip
          active={filters.categories.includes('meeting')}
          onClick={() => handleFilterChange('categories', 'meeting')}
        >
          회의
        </FilterChip>
        <FilterChip
          active={filters.categories.includes('task')}
          onClick={() => handleFilterChange('categories', 'task')}
        >
          업무
        </FilterChip>
        <FilterChip
          active={filters.categories.includes('deadline')}
          onClick={() => handleFilterChange('categories', 'deadline')}
        >
          마감일
        </FilterChip>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>우선순위:</FilterLabel>
        <FilterChip
          active={filters.priority.includes('high')}
          onClick={() => handleFilterChange('priority', 'high')}
        >
          높음
        </FilterChip>
        <FilterChip
          active={filters.priority.includes('medium')}
          onClick={() => handleFilterChange('priority', 'medium')}
        >
          중간
        </FilterChip>
        <FilterChip
          active={filters.priority.includes('low')}
          onClick={() => handleFilterChange('priority', 'low')}
        >
          낮음
        </FilterChip>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>정렬:</FilterLabel>
        <FilterSelect value={sortOption} onChange={handleSortChange}>
          <option value="date-asc">날짜 오름차순</option>
          <option value="date-desc">날짜 내림차순</option>
          <option value="priority">우선순위순</option>
          <option value="status">상태순</option>
        </FilterSelect>
      </FilterGroup>
    </FiltersContainer>
  );
};

export default CalendarFilters; 