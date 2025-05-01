import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { RootState } from '../../store';
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  cloneTemplate,
  importTemplates,
  exportTemplates,
  rollbackTemplate,
} from '../../store/slices/notificationTemplateSlice';
import {
  NotificationTemplate,
  NotificationTemplateType,
  NotificationTemplateCategory,
  TemplatePreviewData,
} from '../../types/notification';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const TemplateList = styled.div`
  margin-bottom: 20px;
`;

const TemplateItem = styled.div`
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TemplateName = styled.h3`
  margin: 0;
`;

const TemplateType = styled.span`
  color: #666;
  font-size: 0.9em;
`;

const TemplateContent = styled.div`
  margin-bottom: 10px;
`;

const TemplateVariables = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
`;

const VariableTag = styled.span`
  background-color: #e3f2fd;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8em;
`;

const TemplateActions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #2196f3;
  color: white;

  &:hover {
    background-color: #1976d2;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  margin-bottom: 10px;
`;

const LoadingMessage = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

const PreviewContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const PreviewTitle = styled.h4`
  margin-bottom: 10px;
`;

const PreviewContent = styled.div`
  white-space: pre-wrap;
`;

const CategoryFilter = styled.div`
  margin-bottom: 20px;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 5px 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#2196f3' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) => (active ? '#1976d2' : '#f5f5f5')};
  }
`;

const VersionHistory = styled.div`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
`;

const VersionItem = styled.div`
  padding: 5px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const UsageStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const StatItem = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 0.8em;
  color: #666;
`;

const ImportExportButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const FileInput = styled.input`
  display: none;
`;

const NotificationTemplateManager: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('schedule');
  const { templates, loading, error } = useSelector(
    (state: RootState) => state.notificationTemplates
  );

  const [selectedCategory, setSelectedCategory] = useState<NotificationTemplateCategory | 'all'>('all');
  const [previewData, setPreviewData] = useState<TemplatePreviewData>({
    title: 'Sample Schedule',
    description: 'This is a sample schedule description',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3600000).toISOString(),
    location: 'Conference Room A',
    category: 'work',
    createdBy: 'John Doe',
  });

  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({
    type: 'email',
    name: '',
    subject: '',
    content: '',
    variables: [],
    isDefault: false,
  });

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTemplate.name && newTemplate.content) {
      await dispatch(createTemplate(newTemplate));
      setNewTemplate({
        name: '',
        type: 'email',
        category: 'work',
        content: '',
        variables: [],
        isDefault: false,
      });
    }
  };

  const handleUpdateTemplate = async (template: NotificationTemplate) => {
    await dispatch(updateTemplate(template));
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm(t('notifications.templates.confirmDelete'))) {
      await dispatch(deleteTemplate(templateId));
    }
  };

  const handleCloneTemplate = async (template: NotificationTemplate) => {
  const availableVariables = [
    '{title}',
    '{description}',
    '{startDate}',
    '{endDate}',
    '{location}',
    '{category}',
    '{createdBy}',
  ];

  const insertVariable = (variable: string) => {
    setNewTemplate((prev) => ({
      ...prev,
      content: `${prev.content || ''}${variable}`,
      variables: [...(prev.variables || []), variable],
    }));
  };

  if (loading) {
    return <LoadingMessage>{t('notifications.templates.loading')}</LoadingMessage>;
  }

  return (
    <Container>
      <Title>{t('notifications.templates.title')}</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleCreateTemplate}>
        <Select
          value={newTemplate.type}
          onChange={(e) =>
            setNewTemplate((prev) => ({ ...prev, type: e.target.value as NotificationTemplateType }))
          }
        >
          <option value="email">{t('notifications.templates.type.email')}</option>
          <option value="browser">{t('notifications.templates.type.browser')}</option>
        </Select>

        <Input
          type="text"
          placeholder={t('notifications.templates.name')}
          value={newTemplate.name}
          onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
        />

        {newTemplate.type === 'email' && (
          <Input
            type="text"
            placeholder={t('notifications.templates.subject')}
            value={newTemplate.subject}
            onChange={(e) => setNewTemplate((prev) => ({ ...prev, subject: e.target.value }))}
          />
        )}

        <TextArea
          placeholder={t('notifications.templates.content')}
          value={newTemplate.content}
          onChange={(e) => setNewTemplate((prev) => ({ ...prev, content: e.target.value }))}
        />

        <TemplateVariables>
          {availableVariables.map((variable) => (
            <VariableTag
              key={variable}
              onClick={() => insertVariable(variable)}
              style={{ cursor: 'pointer' }}
            >
              {variable}
            </VariableTag>
          ))}
        </TemplateVariables>

        <Button type="submit" disabled={!newTemplate.name || !newTemplate.content}>
          {t('notifications.templates.create')}
        </Button>
      </Form>

      <TemplateList>
        {templates.map((template) => (
          <TemplateItem key={template.id}>
            <TemplateHeader>
              <TemplateName>{template.name}</TemplateName>
              <TemplateType>
                {t(`notifications.templates.type.${template.type}`)}
              </TemplateType>
            </TemplateHeader>

            {template.type === 'email' && (
              <TemplateContent>
                <strong>{t('notifications.templates.subject')}:</strong>{' '}
                {template.subject}
              </TemplateContent>
            )}

            <TemplateContent>
              <strong>{t('notifications.templates.content')}:</strong>{' '}
              {template.content}
            </TemplateContent>

            <TemplateVariables>
              {template.variables.map((variable) => (
                <VariableTag key={variable}>{variable}</VariableTag>
              ))}
            </TemplateVariables>

            <TemplateActions>
              <Button onClick={() => handleUpdateTemplate(template)}>
                {t('notifications.templates.edit')}
              </Button>
              <DeleteButton onClick={() => handleDeleteTemplate(template.id)}>
                {t('notifications.templates.delete')}
              </DeleteButton>
            </TemplateActions>
          </TemplateItem>
        ))}
      </TemplateList>
    </Container>
  );
};

export default NotificationTemplateManager; 