import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchPerformanceReports, generatePerformanceReport, fetchReportById, exportReport, } from '../../store/slices/analysisSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const ReportList = styled.div `
  margin-bottom: 20px;
`;
const ReportCard = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background: #e0e0e0;
  }
`;
const ReportHeader = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ReportTitle = styled.h3 `
  margin: 0;
`;
const ReportPeriod = styled.div `
  color: #666;
`;
const ReportMetrics = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;
const MetricCard = styled.div `
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;
const MetricValue = styled.div `
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;
const MetricLabel = styled.div `
  color: #666;
`;
const ChannelPerformance = styled.div `
  margin: 20px 0;
`;
const ChannelTable = styled.table `
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;
const TableHeader = styled.th `
  background: #f5f5f5;
  padding: 10px;
  text-align: left;
`;
const TableCell = styled.td `
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;
const Recommendations = styled.div `
  margin: 20px 0;
`;
const RecommendationCard = styled.div `
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  border-left: 4px solid
    ${props => {
    switch (props.impact) {
        case 'high':
            return '#f44336';
        case 'medium':
            return '#ff9800';
        default:
            return '#4CAF50';
    }
}};
`;
const Form = styled.form `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;
const FormGroup = styled.div `
  margin-bottom: 15px;
`;
const Label = styled.label `
  display: block;
  margin-bottom: 5px;
`;
const Input = styled.input `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Select = styled.select `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Button = styled.button `
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;
const PerformanceAnalysis = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { reports, currentReport, loading, error } = useSelector((state) => state.analysis);
    const [reportType, setReportType] = useState('weekly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    useEffect(() => {
        dispatch(fetchPerformanceReports());
    }, [dispatch]);
    const handleGenerateReport = (e) => {
        e.preventDefault();
        dispatch(generatePerformanceReport({ type: reportType, startDate, endDate }));
    };
    const handleViewReport = (reportId) => {
        dispatch(fetchReportById(reportId));
    };
    const handleExportReport = (reportId) => {
        dispatch(exportReport(reportId));
    };
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.analysis.title') }), _jsxs(Form, { onSubmit: handleGenerateReport, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.analysis.reportType') }), _jsxs(Select, { value: reportType, onChange: e => setReportType(e.target.value), children: [_jsx("option", { value: "weekly", children: t('notifications.analysis.weekly') }), _jsx("option", { value: "monthly", children: t('notifications.analysis.monthly') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.analysis.startDate') }), _jsx(Input, { type: "date", value: startDate, onChange: e => setStartDate(e.target.value), required: true })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.analysis.endDate') }), _jsx(Input, { type: "date", value: endDate, onChange: e => setEndDate(e.target.value), required: true })] }), _jsx(Button, { type: "submit", children: t('notifications.analysis.generate') })] }), _jsx(ReportList, { children: reports.map((report) => (_jsxs(ReportCard, { onClick: () => handleViewReport(report.id), children: [_jsxs(ReportHeader, { children: [_jsxs(ReportTitle, { children: [t(`notifications.analysis.${report.type}`), " ", t('notifications.analysis.report')] }), _jsxs(ReportPeriod, { children: [new Date(report.period.start).toLocaleDateString(), " -", ' ', new Date(report.period.end).toLocaleDateString()] })] }), _jsx(Button, { onClick: e => {
                                e.stopPropagation();
                                handleExportReport(report.id);
                            }, children: t('notifications.analysis.export') })] }, report.id))) }), currentReport && (_jsxs("div", { children: [_jsxs(ReportMetrics, { children: [_jsxs(MetricCard, { children: [_jsx(MetricValue, { children: currentReport.metrics.totalNotifications }), _jsx(MetricLabel, { children: t('notifications.analysis.totalNotifications') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [currentReport.metrics.successRate, "%"] }), _jsx(MetricLabel, { children: t('notifications.analysis.successRate') })] }), _jsxs(MetricCard, { children: [_jsxs(MetricValue, { children: [currentReport.metrics.averageResponseTime, "s"] }), _jsx(MetricLabel, { children: t('notifications.analysis.averageResponseTime') })] })] }), _jsxs(ChannelPerformance, { children: [_jsx("h3", { children: t('notifications.analysis.channelPerformance') }), _jsxs(ChannelTable, { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx(TableHeader, { children: t('notifications.analysis.channel') }), _jsx(TableHeader, { children: t('notifications.analysis.successRate') }), _jsx(TableHeader, { children: t('notifications.analysis.averageResponseTime') }), _jsx(TableHeader, { children: t('notifications.analysis.totalSent') }), _jsx(TableHeader, { children: t('notifications.analysis.totalFailed') })] }) }), _jsx("tbody", { children: currentReport.metrics.channelPerformance.map(channel => (_jsxs("tr", { children: [_jsx(TableCell, { children: channel.channel }), _jsxs(TableCell, { children: [channel.successRate, "%"] }), _jsxs(TableCell, { children: [channel.averageResponseTime, "s"] }), _jsx(TableCell, { children: channel.totalSent }), _jsx(TableCell, { children: channel.totalFailed })] }, channel.channel))) })] })] }), _jsxs(Recommendations, { children: [_jsx("h3", { children: t('notifications.analysis.recommendations') }), currentReport.recommendations.map((recommendation, index) => (_jsxs(RecommendationCard, { impact: recommendation.impact, children: [_jsx("h4", { children: t(`notifications.analysis.types.${recommendation.type}`) }), _jsx("p", { children: recommendation.description }), _jsxs("p", { children: [t('notifications.analysis.implementation'), ": ", recommendation.implementation] })] }, index)))] })] }))] }));
};
export default PerformanceAnalysis;
