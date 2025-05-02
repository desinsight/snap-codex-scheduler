import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchSecuritySettings, updateSecuritySettings, updateBackupSettings, updateErrorHandling, performBackup, } from '../../store/slices/securitySlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const Section = styled.div `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;
const SectionTitle = styled.h3 `
  margin-bottom: 15px;
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
const Checkbox = styled.input `
  margin-right: 10px;
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
const SecuritySettings = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { settings, backup, errorHandling, loading, error } = useSelector((state) => state.security);
    const [currentSettings, setCurrentSettings] = useState(settings);
    const [currentBackup, setCurrentBackup] = useState(backup);
    const [currentErrorHandling, setCurrentErrorHandling] = useState(errorHandling);
    useEffect(() => {
        dispatch(fetchSecuritySettings());
    }, [dispatch]);
    useEffect(() => {
        setCurrentSettings(settings);
        setCurrentBackup(backup);
        setCurrentErrorHandling(errorHandling);
    }, [settings, backup, errorHandling]);
    const handleSettingsChange = (e) => {
        const { name, value, type } = e.target;
        setCurrentSettings(prev => {
            if (!prev)
                return prev;
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? e.target.checked : value,
                    },
                };
            }
            return {
                ...prev,
                [name]: type === 'checkbox' ? e.target.checked : value,
            };
        });
    };
    const handleBackupChange = (e) => {
        const { name, value, type } = e.target;
        setCurrentBackup(prev => {
            if (!prev)
                return prev;
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? e.target.checked : value,
                    },
                };
            }
            return {
                ...prev,
                [name]: type === 'checkbox' ? e.target.checked : value,
            };
        });
    };
    const handleErrorHandlingChange = (e) => {
        const { name, value, type } = e.target;
        setCurrentErrorHandling(prev => {
            if (!prev)
                return prev;
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'checkbox' ? e.target.checked : value,
                    },
                };
            }
            return {
                ...prev,
                [name]: type === 'checkbox' ? e.target.checked : value,
            };
        });
    };
    const handleSaveSettings = () => {
        dispatch(updateSecuritySettings(currentSettings));
    };
    const handleSaveBackup = () => {
        dispatch(updateBackupSettings(currentBackup));
    };
    const handleSaveErrorHandling = () => {
        dispatch(updateErrorHandling(currentErrorHandling));
    };
    const handlePerformBackup = () => {
        dispatch(performBackup());
    };
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.security.title') }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.security.encryption') }), _jsx(FormGroup, { children: _jsxs(Label, { children: [_jsx(Checkbox, { type: "checkbox", name: "encryption.enabled", checked: currentSettings.encryption.enabled, onChange: handleSettingsChange }), t('notifications.security.enableEncryption')] }) }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.algorithm') }), _jsxs(Select, { name: "encryption.algorithm", value: currentSettings.encryption.algorithm, onChange: handleSettingsChange, children: [_jsx("option", { value: "AES-256", children: "AES-256" }), _jsx("option", { value: "RSA-2048", children: "RSA-2048" })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.keyRotationInterval') }), _jsx(Input, { type: "number", name: "encryption.keyRotationInterval", value: currentSettings.encryption.keyRotationInterval, onChange: handleSettingsChange, min: "1" })] })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.security.backup') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.backupFrequency') }), _jsxs(Select, { name: "schedule.frequency", value: currentBackup.schedule.frequency, onChange: handleBackupChange, children: [_jsx("option", { value: "daily", children: t('notifications.security.daily') }), _jsx("option", { value: "weekly", children: t('notifications.security.weekly') }), _jsx("option", { value: "monthly", children: t('notifications.security.monthly') })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.backupTime') }), _jsx(Input, { type: "time", name: "schedule.time", value: currentBackup.schedule.time, onChange: handleBackupChange })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.retentionPeriod') }), _jsx(Input, { type: "number", name: "retention.period", value: currentBackup.retention.period, onChange: handleBackupChange, min: "1" })] }), _jsx(Button, { onClick: handlePerformBackup, children: t('notifications.security.performBackup') })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('notifications.security.errorHandling') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.maxAttempts') }), _jsx(Input, { type: "number", name: "retryPolicy.maxAttempts", value: currentErrorHandling.retryPolicy.maxAttempts, onChange: handleErrorHandlingChange, min: "1" })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.security.backoffInterval') }), _jsx(Input, { type: "number", name: "retryPolicy.backoffInterval", value: currentErrorHandling.retryPolicy.backoffInterval, onChange: handleErrorHandlingChange, min: "1" })] }), _jsx(FormGroup, { children: _jsxs(Label, { children: [_jsx(Checkbox, { type: "checkbox", name: "retryPolicy.exponential", checked: currentErrorHandling.retryPolicy.exponential, onChange: handleErrorHandlingChange }), t('notifications.security.exponentialBackoff')] }) })] }), _jsx(Button, { onClick: handleSaveSettings, children: t('common.save') })] }));
};
export default SecuritySettings;
