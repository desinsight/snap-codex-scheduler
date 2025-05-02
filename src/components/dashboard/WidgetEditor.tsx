import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { WidgetConfig, WidgetType, ChartType } from '../../types/dashboard';
import { DashboardService } from '../../services/DashboardService';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
  widget?: WidgetConfig | null;
  onSave: (widget: Partial<WidgetConfig>) => void;
  onClose: () => void;
}

const WidgetEditor: React.FC<Props> = ({ widget, onSave, onClose }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(widget?.title || '');
  const [type, setType] = useState<WidgetType>(widget?.type || 'chart');
  const [settings, setSettings] = useState(widget?.settings || {});
  
  const dashboardService = DashboardService.getInstance();
  const metricUnits = dashboardService.getMetricUnits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      type,
      settings,
      ...(widget?.id ? { id: widget.id } : {})
    });
  };

  const renderChartSettings = () => (
    <>
      <FormGroup>
        <Label>{t('dashboard.widget.chartType')}</Label>
        <Select
          value={settings.chartType || 'line'}
          onChange={e => setSettings({ ...settings, chartType: e.target.value as ChartType })}
        >
          <option value="line">{t('dashboard.widget.chartTypes.line')}</option>
          <option value="bar">{t('dashboard.widget.chartTypes.bar')}</option>
          <option value="area">{t('dashboard.widget.chartTypes.area')}</option>
          <option value="pie">{t('dashboard.widget.chartTypes.pie')}</option>
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>{t('dashboard.widget.metric')}</Label>
        <Input
          type="text"
          value={settings.metric || ''}
          onChange={e => setSettings({ ...settings, metric: e.target.value })}
          placeholder={t('dashboard.widget.metricPlaceholder')}
        />
      </FormGroup>
      <FormGroup>
        <Label>{t('dashboard.widget.query')}</Label>
        <Input
          type="text"
          value={settings.query || ''}
          onChange={e => setSettings({ ...settings, query: e.target.value })}
          placeholder={t('dashboard.widget.queryPlaceholder')}
        />
      </FormGroup>
    </>
  );

  const renderMetricSettings = () => (
    <>
      <FormGroup>
        <Label>{t('dashboard.widget.metric')}</Label>
        <Input
          type="text"
          value={settings.metric || ''}
          onChange={e => setSettings({ ...settings, metric: e.target.value })}
          placeholder={t('dashboard.widget.metricPlaceholder')}
        />
      </FormGroup>
      <FormGroup>
        <Label>{t('dashboard.widget.unit')}</Label>
        <Select
          value={settings.unit || ''}
          onChange={e => setSettings({ ...settings, unit: e.target.value })}
        >
          <option value="">{t('dashboard.widget.noUnit')}</option>
          {metricUnits.map(unit => (
            <option key={unit.id} value={unit.id}>
              {unit.name} ({unit.symbol})
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
        <Label>{t('dashboard.widget.refreshInterval')}</Label>
        <Select
          value={settings.refreshInterval || 0}
          onChange={e => setSettings({ ...settings, refreshInterval: Number(e.target.value) })}
        >
          <option value={0}>{t('dashboard.widget.noRefresh')}</option>
          <option value={5000}>5 {t('common.seconds')}</option>
          <option value={10000}>10 {t('common.seconds')}</option>
          <option value={30000}>30 {t('common.seconds')}</option>
          <option value={60000}>1 {t('common.minute')}</option>
        </Select>
      </FormGroup>
    </>
  );

  return (
    <Modal onClick={onClose}>
      <Container onClick={e => e.stopPropagation()}>
        <Title>
          {widget ? t('dashboard.widget.edit') : t('dashboard.widget.create')}
        </Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{t('dashboard.widget.title')}</Label>
            <Input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('dashboard.widget.titlePlaceholder')}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('dashboard.widget.type')}</Label>
            <Select value={type} onChange={e => setType(e.target.value as WidgetType)}>
              <option value="chart">{t('dashboard.widget.types.chart')}</option>
              <option value="metric">{t('dashboard.widget.types.metric')}</option>
              <option value="table">{t('dashboard.widget.types.table')}</option>
              <option value="status">{t('dashboard.widget.types.status')}</option>
            </Select>
          </FormGroup>

          {type === 'chart' && renderChartSettings()}
          {type === 'metric' && renderMetricSettings()}
          {/* 테이블과 상태 위젯 설정은 별도로 구현 필요 */}

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {widget ? t('common.save') : t('common.create')}
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    </Modal>
  );
};

export default WidgetEditor; 