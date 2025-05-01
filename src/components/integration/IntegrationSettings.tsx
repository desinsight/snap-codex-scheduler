import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchIntegrations, addService, updateService, addWebhook } from '../../store/slices/integrationSlice';
import { ExternalServiceConfig, WebhookConfig } from '../../types/integration';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Section = styled.section`
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const ServiceList = styled.div`
  margin-top: 20px;
`;

const ServiceItem = styled.div`
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 10px;
`;

const IntegrationSettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { services, webhooks, loading, error } = useSelector((state: any) => state.integration);

  const [newService, setNewService] = useState<Partial<ExternalServiceConfig>>({
    serviceType: 'slack',
    name: '',
    webhookUrl: '',
    enabled: true,
  });

  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    url: '',
    secret: '',
    events: [],
    retryPolicy: {
      maxAttempts: 3,
      backoffInterval: 1000,
    },
  });

  useEffect(() => {
    dispatch(fetchIntegrations());
  }, [dispatch]);

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addService(newService as ExternalServiceConfig));
    setNewService({
      serviceType: 'slack',
      name: '',
      webhookUrl: '',
      enabled: true,
    });
  };

  const handleWebhookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addWebhook(newWebhook as WebhookConfig));
    setNewWebhook({
      url: '',
      secret: '',
      events: [],
      retryPolicy: {
        maxAttempts: 3,
        backoffInterval: 1000,
      },
    });
  };

  return (
    <Container>
      <Title>{t('integration.title')}</Title>

      <Section>
        <h3>{t('integration.services')}</h3>
        <form onSubmit={handleServiceSubmit}>
          <FormGroup>
            <Label>{t('integration.serviceType')}</Label>
            <Select
              value={newService.serviceType}
              onChange={(e) => setNewService({ ...newService, serviceType: e.target.value as any })}
            >
              <option value="slack">Slack</option>
              <option value="teams">Microsoft Teams</option>
              <option value="webhook">Webhook</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>{t('integration.name')}</Label>
            <Input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('integration.webhookUrl')}</Label>
            <Input
              type="text"
              value={newService.webhookUrl}
              onChange={(e) => setNewService({ ...newService, webhookUrl: e.target.value })}
            />
          </FormGroup>

          <Button type="submit">{t('integration.addService')}</Button>
        </form>

        <ServiceList>
          {services.map((service: ExternalServiceConfig) => (
            <ServiceItem key={service.name}>
              <div>
                <strong>{service.name}</strong>
                <div>{service.serviceType}</div>
              </div>
              <div>
                <Button
                  onClick={() => dispatch(updateService({
                    id: service.name,
                    service: { enabled: !service.enabled }
                  }))}
                >
                  {service.enabled ? t('integration.disable') : t('integration.enable')}
                </Button>
              </div>
            </ServiceItem>
          ))}
        </ServiceList>
      </Section>

      <Section>
        <h3>{t('integration.webhooks')}</h3>
        <form onSubmit={handleWebhookSubmit}>
          <FormGroup>
            <Label>{t('integration.webhookUrl')}</Label>
            <Input
              type="text"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('integration.secret')}</Label>
            <Input
              type="password"
              value={newWebhook.secret}
              onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
            />
          </FormGroup>

          <Button type="submit">{t('integration.addWebhook')}</Button>
        </form>
      </Section>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default IntegrationSettings; 