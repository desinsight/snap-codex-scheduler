import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  fetchSecuritySettings,
  updateSecuritySettings,
  updateBackupSettings,
  updateErrorHandling,
  performBackup,
} from '../../store/slices/securitySlice';
import { SecuritySettings, BackupSettings, ErrorHandling } from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Section = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
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

const Checkbox = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const SecuritySettings: React.FC = () => {
  const { t } = useTranslation('schedule');
  const dispatch = useDispatch();
  const { settings, backup, errorHandling, loading, error } = useSelector((state: any) => state.security);
  const [currentSettings, setCurrentSettings] = useState<SecuritySettings>(settings);
  const [currentBackup, setCurrentBackup] = useState<BackupSettings>(backup);
  const [currentErrorHandling, setCurrentErrorHandling] = useState<ErrorHandling>(errorHandling);

  useEffect(() => {
    dispatch(fetchSecuritySettings());
  }, [dispatch]);

  useEffect(() => {
    setCurrentSettings(settings);
    setCurrentBackup(backup);
    setCurrentErrorHandling(errorHandling);
  }, [settings, backup, errorHandling]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCurrentSettings((prev) => {
      if (!prev) return prev;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof SecuritySettings],
            [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
          },
        };
      }
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
    });
  };

  const handleBackupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCurrentBackup((prev) => {
      if (!prev) return prev;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof BackupSettings],
            [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
          },
        };
      }
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
    });
  };

  const handleErrorHandlingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCurrentErrorHandling((prev) => {
      if (!prev) return prev;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof ErrorHandling],
            [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
          },
        };
      }
      return {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Title>{t('notifications.security.title')}</Title>

      <Section>
        <SectionTitle>{t('notifications.security.encryption')}</SectionTitle>
        <FormGroup>
          <Label>
            <Checkbox
              type="checkbox"
              name="encryption.enabled"
              checked={currentSettings.encryption.enabled}
              onChange={handleSettingsChange}
            />
            {t('notifications.security.enableEncryption')}
          </Label>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.security.algorithm')}</Label>
          <Select
            name="encryption.algorithm"
            value={currentSettings.encryption.algorithm}
            onChange={handleSettingsChange}
          >
            <option value="AES-256">AES-256</option>
            <option value="RSA-2048">RSA-2048</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.security.keyRotationInterval')}</Label>
          <Input
            type="number"
            name="encryption.keyRotationInterval"
            value={currentSettings.encryption.keyRotationInterval}
            onChange={handleSettingsChange}
            min="1"
          />
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>{t('notifications.security.backup')}</SectionTitle>
        <FormGroup>
          <Label>{t('notifications.security.backupFrequency')}</Label>
          <Select
            name="schedule.frequency"
            value={currentBackup.schedule.frequency}
            onChange={handleBackupChange}
          >
            <option value="daily">{t('notifications.security.daily')}</option>
            <option value="weekly">{t('notifications.security.weekly')}</option>
            <option value="monthly">{t('notifications.security.monthly')}</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.security.backupTime')}</Label>
          <Input
            type="time"
            name="schedule.time"
            value={currentBackup.schedule.time}
            onChange={handleBackupChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.security.retentionPeriod')}</Label>
          <Input
            type="number"
            name="retention.period"
            value={currentBackup.retention.period}
            onChange={handleBackupChange}
            min="1"
          />
        </FormGroup>
        <Button onClick={handlePerformBackup}>
          {t('notifications.security.performBackup')}
        </Button>
      </Section>

      <Section>
        <SectionTitle>{t('notifications.security.errorHandling')}</SectionTitle>
        <FormGroup>
          <Label>{t('notifications.security.maxAttempts')}</Label>
          <Input
            type="number"
            name="retryPolicy.maxAttempts"
            value={currentErrorHandling.retryPolicy.maxAttempts}
            onChange={handleErrorHandlingChange}
            min="1"
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('notifications.security.backoffInterval')}</Label>
          <Input
            type="number"
            name="retryPolicy.backoffInterval"
            value={currentErrorHandling.retryPolicy.backoffInterval}
            onChange={handleErrorHandlingChange}
            min="1"
          />
        </FormGroup>
        <FormGroup>
          <Label>
            <Checkbox
              type="checkbox"
              name="retryPolicy.exponential"
              checked={currentErrorHandling.retryPolicy.exponential}
              onChange={handleErrorHandlingChange}
            />
            {t('notifications.security.exponentialBackoff')}
          </Label>
        </FormGroup>
      </Section>

      <Button onClick={handleSaveSettings}>{t('common.save')}</Button>
    </Container>
  );
};

export default SecuritySettings; 