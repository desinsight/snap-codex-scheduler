import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Schedule, ScheduleCategory } from '../../types/schedule';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #666;
  margin-right: 0.5rem;
`;

interface ScheduleFilterProps {
  onFilterChange: (filter: Partial<Schedule>) => void;
}

const ScheduleFilter: React.FC<ScheduleFilterProps> = ({ onFilterChange }) => {
  const { t } = useTranslation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ title: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category: e.target.value as ScheduleCategory });
  };

  const handleSharedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ isShared: e.target.value === 'true' });
  };

  return (
    <FilterContainer>
      <FilterLabel>{t('schedule.filter.search')}</FilterLabel>
      <FilterInput
        type="text"
        placeholder={t('schedule.filter.searchPlaceholder')}
        onChange={handleSearchChange}
      />

      <FilterLabel>{t('schedule.filter.category')}</FilterLabel>
      <FilterSelect onChange={handleCategoryChange}>
        <option value="">{t('schedule.filter.allCategories')}</option>
        {Object.values(ScheduleCategory).map((category) => (
          <option key={category} value={category}>
            {t(`schedule.category.${category.toLowerCase()}`)}
          </option>
        ))}
      </FilterSelect>

      <FilterLabel>{t('schedule.filter.shared')}</FilterLabel>
      <FilterSelect onChange={handleSharedChange}>
        <option value="">{t('schedule.filter.all')}</option>
        <option value="true">{t('schedule.filter.shared')}</option>
        <option value="false">{t('schedule.filter.notShared')}</option>
      </FilterSelect>
    </FilterContainer>
  );
};

export default ScheduleFilter; 