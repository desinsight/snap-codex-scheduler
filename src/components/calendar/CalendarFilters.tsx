import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

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

export type SortOption = 'date-asc' | 'date-desc' | 'priority' | 'status';

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.text.tertiary}20;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  width: 300px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
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

const FilterChip = styled.div<{ active?: boolean }>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ active, theme }) =>
    active ? theme.colors.surface : theme.colors.text.primary};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text.tertiary}20;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.text.tertiary}40;
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
    <FiltersContainer>
      <SearchInput
        type="text"
        placeholder="일정 검색..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

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