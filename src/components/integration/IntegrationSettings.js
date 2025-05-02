import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchIntegrations, addService, updateService, addWebhook, } from '../../store/slices/integrationSlice';
const Container = styled.div `
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const Section = styled.section `
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const FormGroup = styled.div `
  margin-bottom: 15px;
`;
const Label = styled.label `
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;
const Input = styled.input `
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
`;
const Select = styled.select `
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 14px;
`;
const Button = styled.button `
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
const ServiceList = styled.div `
  margin-top: 20px;
`;
const ServiceItem = styled.div `
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ErrorMessage = styled.div `
  color: ${({ theme }) => theme.colors.error};
  margin-top: 10px;
`;
const IntegrationSettings = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { services, webhooks, loading, error } = useSelector((state) => state.integration);
    const [newService, setNewService] = useState({
        serviceType: 'slack',
        name: '',
        webhookUrl: '',
        enabled: true,
    });
    const [newWebhook, setNewWebhook] = useState({
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
    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        await dispatch(addService(newService));
        setNewService({
            serviceType: 'slack',
            name: '',
            webhookUrl: '',
            enabled: true,
        });
    };
    const handleWebhookSubmit = async (e) => {
        e.preventDefault();
        await dispatch(addWebhook(newWebhook));
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
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('integration.title') }), _jsxs(Section, { children: [_jsx("h3", { children: t('integration.services') }), _jsxs("form", { onSubmit: handleServiceSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('integration.serviceType') }), _jsxs(Select, { value: newService.serviceType, onChange: e => setNewService({ ...newService, serviceType: e.target.value }), children: [_jsx("option", { value: "slack", children: "Slack" }), _jsx("option", { value: "teams", children: "Microsoft Teams" }), _jsx("option", { value: "webhook", children: "Webhook" })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('integration.name') }), _jsx(Input, { type: "text", value: newService.name, onChange: e => setNewService({ ...newService, name: e.target.value }) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('integration.webhookUrl') }), _jsx(Input, { type: "text", value: newService.webhookUrl, onChange: e => setNewService({ ...newService, webhookUrl: e.target.value }) })] }), _jsx(Button, { type: "submit", children: t('integration.addService') })] }), _jsx(ServiceList, { children: services.map((service) => (_jsxs(ServiceItem, { children: [_jsxs("div", { children: [_jsx("strong", { children: service.name }), _jsx("div", { children: service.serviceType })] }), _jsx("div", { children: _jsx(Button, { onClick: () => dispatch(updateService({
                                            id: service.name,
                                            service: { enabled: !service.enabled },
                                        })), children: service.enabled ? t('integration.disable') : t('integration.enable') }) })] }, service.name))) })] }), _jsxs(Section, { children: [_jsx("h3", { children: t('integration.webhooks') }), _jsxs("form", { onSubmit: handleWebhookSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('integration.webhookUrl') }), _jsx(Input, { type: "text", value: newWebhook.url, onChange: e => setNewWebhook({ ...newWebhook, url: e.target.value }) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('integration.secret') }), _jsx(Input, { type: "password", value: newWebhook.secret, onChange: e => setNewWebhook({ ...newWebhook, secret: e.target.value }) })] }), _jsx(Button, { type: "submit", children: t('integration.addWebhook') })] })] }), error && _jsx(ErrorMessage, { children: error })] }));
};
export default IntegrationSettings;
