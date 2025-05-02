import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DashboardService } from '../../services/DashboardService';
const Table = styled.table `
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSize.small};
`;
const Th = styled.th `
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: ${({ sortable }) => (sortable ? 'pointer' : 'default')};
  &:hover {
    background-color: ${({ theme, sortable }) => sortable ? theme.colors.surface : 'inherit'};
  }
`;
const Td = styled.td `
  padding: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const Tr = styled.tr `
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;
const Pagination = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 8px;
`;
const PageInfo = styled.div `
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
`;
const PageButton = styled.button `
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;
const FilterInput = styled.input `
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  width: 100%;
`;
const TableWidget = ({ widget }) => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState(null);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const dashboardService = DashboardService.getInstance();
    // 데이터 로딩
    React.useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // 실제 구현에서는 API에서 데이터를 가져와야 합니다
                const response = await fetch(widget.settings.query || '');
                const jsonData = await response.json();
                setData(jsonData);
                setError(null);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
        // 실시간 업데이트 설정
        if (widget.settings.refreshInterval) {
            const interval = setInterval(loadData, widget.settings.refreshInterval);
            return () => clearInterval(interval);
        }
    }, [widget.settings.query, widget.settings.refreshInterval]);
    // 정렬 및 필터링
    const processedData = useMemo(() => {
        let result = [...data];
        // 필터링
        if (filter) {
            result = result.filter(row => Object.values(row).some(value => String(value).toLowerCase().includes(filter.toLowerCase())));
        }
        // 정렬
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue)
                    return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue)
                    return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [data, filter, sortConfig]);
    // 페이지네이션
    const totalPages = Math.ceil(processedData.length / pageSize);
    const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const handleSort = (key) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return {
                    key,
                    direction: current.direction === 'asc' ? 'desc' : 'asc'
                };
            }
            return { key, direction: 'asc' };
        });
    };
    if (loading)
        return _jsx("div", { children: t('common.loading') });
    if (error)
        return _jsx("div", { children: error });
    if (data.length === 0)
        return _jsx("div", { children: t('common.noData') });
    const columns = Object.keys(data[0] || {});
    return (_jsxs("div", { children: [_jsx(FilterInput, { type: "text", placeholder: t('common.search'), value: filter, onChange: e => setFilter(e.target.value) }), _jsxs(Table, { children: [_jsx("thead", { children: _jsx("tr", { children: columns.map(column => (_jsxs(Th, { sortable: true, onClick: () => handleSort(column), children: [column, sortConfig?.key === column && (_jsx("span", { children: sortConfig.direction === 'asc' ? ' ↑' : ' ↓' }))] }, column))) }) }), _jsx("tbody", { children: paginatedData.map((row, index) => (_jsx(Tr, { children: columns.map(column => (_jsx(Td, { children: dashboardService.formatMetricValue(row[column], widget.settings.unit || '') }, column))) }, index))) })] }), _jsxs(Pagination, { children: [_jsx(PageInfo, { children: t('common.pageInfo', {
                            current: currentPage,
                            total: totalPages,
                            totalItems: processedData.length
                        }) }), _jsxs("div", { children: [_jsx(PageButton, { disabled: currentPage === 1, onClick: () => setCurrentPage(p => p - 1), children: t('common.previous') }), _jsx(PageButton, { disabled: currentPage === totalPages, onClick: () => setCurrentPage(p => p + 1), children: t('common.next') })] })] })] }));
};
export default TableWidget;
