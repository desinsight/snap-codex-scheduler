import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchPerformanceReports,
  generatePerformanceReport,
  fetchReportById,
  exportReport,
  clearCurrentReport,
} from '../../store/slices/analysisSlice';
import { PerformanceReport } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ReportList = styled.div`
  margin-bottom: 20px;
`;

const ReportCard = styled.div`
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

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReportTitle = styled.h3`
  margin: 0;
`;

const ReportPeriod = styled.div`
  color: #666;
`;

const ReportMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const MetricCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  color: #666;
`;

const ChannelPerformance = styled.div`
  margin: 20px 0;
`;

const ChannelTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  background: #f5f5f5;
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Recommendations = styled.div`
  margin: 20px 0;
`;

const RecommendationCard = styled.div<{ impact: string }>`
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

const Form = styled.form`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const PerformanceAnalysis: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { reports, currentReport, loading, error } = useSelector((state: any) => state.analysis);
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchPerformanceReports());
  }, [dispatch]);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(generatePerformanceReport({ type: reportType, startDate, endDate }));
  };

  const handleViewReport = (reportId: string) => {
    dispatch(fetchReportById(reportId));
  };

  const handleExportReport = (reportId: string) => {
    dispatch(exportReport(reportId));
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>{t('notifications.analysis.title')}</Title>
      <Form onSubmit={handleGenerateReport}>
        <FormGroup>
          <Label>{t('notifications.analysis.reportType')}</Label>
          <Select
            value={reportType}
            onChange={e => setReportType(e.target.value as 'weekly' | 'monthly')}
          >
            <option value="weekly">{t('notifications.analysis.weekly')}</option>
            <option value="monthly">{t('notifications.analysis.monthly')}</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.analysis.startDate')}</Label>
          <Input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.analysis.endDate')}</Label>
          <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        </FormGroup>
        <Button type="submit">{t('notifications.analysis.generate')}</Button>
      </Form>
      <ReportList>
        {reports.map((report: PerformanceReport) => (
          <ReportCard key={report.id} onClick={() => handleViewReport(report.id)}>
            <ReportHeader>
              <ReportTitle>
                {t(`notifications.analysis.${report.type}`)} {t('notifications.analysis.report')}
              </ReportTitle>
              <ReportPeriod>
                {new Date(report.period.start).toLocaleDateString()} -{' '}
                {new Date(report.period.end).toLocaleDateString()}
              </ReportPeriod>
            </ReportHeader>
            <Button
              onClick={e => {
                e.stopPropagation();
                handleExportReport(report.id);
              }}
            >
              {t('notifications.analysis.export')}
            </Button>
          </ReportCard>
        ))}
      </ReportList>
      {currentReport && (
        <div>
          <ReportMetrics>
            <MetricCard>
              <MetricValue>{currentReport.metrics.totalNotifications}</MetricValue>
              <MetricLabel>{t('notifications.analysis.totalNotifications')}</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{currentReport.metrics.successRate}%</MetricValue>
              <MetricLabel>{t('notifications.analysis.successRate')}</MetricLabel>
            </MetricCard>
            <MetricCard>
              <MetricValue>{currentReport.metrics.averageResponseTime}s</MetricValue>
              <MetricLabel>{t('notifications.analysis.averageResponseTime')}</MetricLabel>
            </MetricCard>
          </ReportMetrics>
          <ChannelPerformance>
            <h3>{t('notifications.analysis.channelPerformance')}</h3>
            <ChannelTable>
              <thead>
                <tr>
                  <TableHeader>{t('notifications.analysis.channel')}</TableHeader>
                  <TableHeader>{t('notifications.analysis.successRate')}</TableHeader>
                  <TableHeader>{t('notifications.analysis.averageResponseTime')}</TableHeader>
                  <TableHeader>{t('notifications.analysis.totalSent')}</TableHeader>
                  <TableHeader>{t('notifications.analysis.totalFailed')}</TableHeader>
                </tr>
              </thead>
              <tbody>
                {currentReport.metrics.channelPerformance.map(channel => (
                  <tr key={channel.channel}>
                    <TableCell>{channel.channel}</TableCell>
                    <TableCell>{channel.successRate}%</TableCell>
                    <TableCell>{channel.averageResponseTime}s</TableCell>
                    <TableCell>{channel.totalSent}</TableCell>
                    <TableCell>{channel.totalFailed}</TableCell>
                  </tr>
                ))}
              </tbody>
            </ChannelTable>
          </ChannelPerformance>
          <Recommendations>
            <h3>{t('notifications.analysis.recommendations')}</h3>
            {currentReport.recommendations.map((recommendation, index) => (
              <RecommendationCard key={index} impact={recommendation.impact}>
                <h4>{t(`notifications.analysis.types.${recommendation.type}`)}</h4>
                <p>{recommendation.description}</p>
                <p>
                  {t('notifications.analysis.implementation')}: {recommendation.implementation}
                </p>
              </RecommendationCard>
            ))}
          </Recommendations>
        </div>
      )}
    </Container>
  );
};

export default PerformanceAnalysis;
