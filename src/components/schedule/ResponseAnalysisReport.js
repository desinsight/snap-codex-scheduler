import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, } from 'recharts';
import { fetchReports, generateReport, exportReport, } from '../../store/slices/responseAnalysisSlice';
const ReportContainer = styled.div `
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;
const Title = styled.h1 `
  margin-bottom: 20px;
  color: #333;
`;
const Section = styled.div `
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;
const SectionTitle = styled.h2 `
  margin-bottom: 20px;
  color: #333;
`;
const Grid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;
const Card = styled.div `
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
`;
const CardTitle = styled.h3 `
  margin-bottom: 10px;
  color: #333;
`;
const Stat = styled.div `
  margin-bottom: 8px;
`;
const StatLabel = styled.span `
  color: #666;
  margin-right: 5px;
`;
const StatValue = styled.span `
  font-weight: bold;
  color: #333;
`;
const FormGroup = styled.div `
  margin-bottom: 20px;
`;
const Label = styled.label `
  display: block;
  margin-bottom: 8px;
  color: #666;
`;
const Input = styled.input `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;
const Button = styled.button `
  padding: 10px 20px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;

  &:hover {
    background-color: #40a9ff;
  }

  &:disabled {
    background-color: #d9d9d9;
    cursor: not-allowed;
  }
`;
const ChartContainer = styled.div `
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
`;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const ResponseAnalysisReport = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { reports, currentReport, loading, error } = useSelector((state) => state.responseAnalysis);
    const [period, setPeriod] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });
    useEffect(() => {
        dispatch(fetchReports());
    }, [dispatch]);
    const handlePeriodChange = (e) => {
        const { name, value } = e.target;
        setPeriod(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleGenerateReport = () => {
        dispatch(generateReport({
            start: new Date(period.start),
            end: new Date(period.end),
        }));
    };
    const handleExportReport = (reportId) => {
        dispatch(exportReport(reportId));
    };
    if (loading) {
        return _jsx("div", { children: t('loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(ReportContainer, { children: [_jsx(Title, { children: t('notifications.analysis.title') }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.analysis.generateReport') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.analysis.startDate') }), _jsx(Input, { type: "date", name: "start", value: period.start, onChange: handlePeriodChange })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.analysis.endDate') }), _jsx(Input, { type: "date", name: "end", value: period.end, onChange: handlePeriodChange })] }), _jsx(Button, { onClick: handleGenerateReport, disabled: loading, children: t('notifications.analysis.generate') })] }), currentReport && (_jsxs(_Fragment, { children: [_jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.analysis.summary') }), _jsxs(Grid, { children: [_jsxs(Card, { children: [_jsx(CardTitle, { children: t('notifications.analysis.totalResponses') }), _jsx(Stat, { children: _jsx(StatValue, { children: currentReport.summary.totalResponses }) })] }), _jsxs(Card, { children: [_jsx(CardTitle, { children: t('notifications.analysis.averageResponseTime') }), _jsx(Stat, { children: _jsxs(StatValue, { children: [currentReport.summary.averageResponseTime.toFixed(2), "s"] }) })] }), _jsxs(Card, { children: [_jsx(CardTitle, { children: t('notifications.analysis.responseRate') }), _jsx(Stat, { children: _jsxs(StatValue, { children: [(currentReport.summary.responseRate * 100).toFixed(1), "%"] }) })] })] })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.analysis.channelDistribution') }), _jsx(ChartContainer, { children: _jsxs(PieChart, { width: 800, height: 400, children: [_jsx(Pie, { data: currentReport.summary.channelDistribution, dataKey: "count", nameKey: "channel", cx: "50%", cy: "50%", outerRadius: 150, label: true, children: currentReport.summary.channelDistribution.map((entry, index) => (_jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.analysis.trends') }), _jsx(ChartContainer, { children: _jsxs(LineChart, { width: 800, height: 400, data: currentReport.trends, margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "responseCount", stroke: "#8884d8", name: t('notifications.analysis.responseCount') }), _jsx(Line, { type: "monotone", dataKey: "averageResponseTime", stroke: "#82ca9d", name: t('notifications.analysis.averageResponseTime') })] }) })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.analysis.recommendations') }), _jsx(Grid, { children: currentReport.recommendations.map((recommendation, index) => (_jsxs(Card, { children: [_jsx(CardTitle, { children: recommendation.channel }), _jsx(Stat, { children: _jsx(StatValue, { children: recommendation.suggestion }) }), _jsxs(Stat, { children: [_jsxs(StatLabel, { children: [t('notifications.analysis.impact'), ":"] }), _jsx(StatValue, { children: recommendation.impact })] })] }, index))) })] }), _jsx(Button, { onClick: () => handleExportReport(currentReport.id), children: t('notifications.analysis.export') })] }))] }));
};
export default ResponseAnalysisReport;
