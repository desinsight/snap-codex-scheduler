import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  fetchReports,
  fetchReportById,
  generateReport,
  exportReport,
  clearCurrentReport,
} from '../../store/slices/responseAnalysisSlice';
import { RootState } from '../../store';
import { ResponseAnalysisReport } from '../../types/notification';

const ReportContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #333;
`;

const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const CardTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
`;

const Stat = styled.div`
  margin-bottom: 8px;
`;

const StatLabel = styled.span`
  color: #666;
  margin-right: 5px;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #666;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
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

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ResponseAnalysisReport: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { reports, currentReport, loading, error } = useSelector(
    (state: RootState) => state.responseAnalysis
  );

  const [period, setPeriod] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPeriod(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateReport = () => {
    dispatch(
      generateReport({
        start: new Date(period.start),
        end: new Date(period.end),
      })
    );
  };

  const handleExportReport = (reportId: string) => {
    dispatch(exportReport(reportId));
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <ReportContainer>
      <Title>{t('notifications.analysis.title')}</Title>

      <Section>
        <SectionTitle>{t('notifications.analysis.generateReport')}</SectionTitle>
        <FormGroup>
          <Label>{t('notifications.analysis.startDate')}</Label>
          <Input type="date" name="start" value={period.start} onChange={handlePeriodChange} />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.analysis.endDate')}</Label>
          <Input type="date" name="end" value={period.end} onChange={handlePeriodChange} />
        </FormGroup>
        <Button onClick={handleGenerateReport} disabled={loading}>
          {t('notifications.analysis.generate')}
        </Button>
      </Section>

      {currentReport && (
        <>
          <Section>
            <SectionTitle>{t('notifications.analysis.summary')}</SectionTitle>
            <Grid>
              <Card>
                <CardTitle>{t('notifications.analysis.totalResponses')}</CardTitle>
                <Stat>
                  <StatValue>{currentReport.summary.totalResponses}</StatValue>
                </Stat>
              </Card>
              <Card>
                <CardTitle>{t('notifications.analysis.averageResponseTime')}</CardTitle>
                <Stat>
                  <StatValue>{currentReport.summary.averageResponseTime.toFixed(2)}s</StatValue>
                </Stat>
              </Card>
              <Card>
                <CardTitle>{t('notifications.analysis.responseRate')}</CardTitle>
                <Stat>
                  <StatValue>{(currentReport.summary.responseRate * 100).toFixed(1)}%</StatValue>
                </Stat>
              </Card>
            </Grid>
          </Section>

          <Section>
            <SectionTitle>{t('notifications.analysis.channelDistribution')}</SectionTitle>
            <ChartContainer>
              <PieChart width={800} height={400}>
                <Pie
                  data={currentReport.summary.channelDistribution}
                  dataKey="count"
                  nameKey="channel"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label
                >
                  {currentReport.summary.channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </Section>

          <Section>
            <SectionTitle>{t('notifications.analysis.trends')}</SectionTitle>
            <ChartContainer>
              <LineChart
                width={800}
                height={400}
                data={currentReport.trends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="responseCount"
                  stroke="#8884d8"
                  name={t('notifications.analysis.responseCount')}
                />
                <Line
                  type="monotone"
                  dataKey="averageResponseTime"
                  stroke="#82ca9d"
                  name={t('notifications.analysis.averageResponseTime')}
                />
              </LineChart>
            </ChartContainer>
          </Section>

          <Section>
            <SectionTitle>{t('notifications.analysis.recommendations')}</SectionTitle>
            <Grid>
              {currentReport.recommendations.map((recommendation, index) => (
                <Card key={index}>
                  <CardTitle>{recommendation.channel}</CardTitle>
                  <Stat>
                    <StatValue>{recommendation.suggestion}</StatValue>
                  </Stat>
                  <Stat>
                    <StatLabel>{t('notifications.analysis.impact')}:</StatLabel>
                    <StatValue>{recommendation.impact}</StatValue>
                  </Stat>
                </Card>
              ))}
            </Grid>
          </Section>

          <Button onClick={() => handleExportReport(currentReport.id)}>
            {t('notifications.analysis.export')}
          </Button>
        </>
      )}
    </ReportContainer>
  );
};

export default ResponseAnalysisReport;
