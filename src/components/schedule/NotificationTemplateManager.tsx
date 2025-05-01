import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface NotificationTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.text.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const TemplateList = styled.div`
  display: grid;
  gap: 1rem;
`;

const TemplateItem = styled(motion.div)`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TemplateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TemplateName = styled.h3`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Content = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  margin-bottom: 1rem;
`;

const Variables = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Variable = styled.span`
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const NotificationTemplateManager: React.FC = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // TODO: Fetch templates from API
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Schedule Reminder',
        content: 'Reminder: Your schedule {{scheduleName}} is starting in {{timeUntilStart}}.',
        variables: ['scheduleName', 'timeUntilStart'],
        isActive: true,
      },
      {
        id: '2',
        name: 'Schedule Update',
        content: 'The schedule {{scheduleName}} has been updated. New time: {{newTime}}.',
        variables: ['scheduleName', 'newTime'],
        isActive: true,
      },
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setEditingTemplate(null);
  };

  const handleEdit = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const content = formData.get('content') as string;
    const variables = content
      .match(/{{([^}]+)}}/g)
      ?.map(match => match.slice(2, -2))
      .filter(Boolean) || [];

    if (isAdding) {
      const newTemplate: NotificationTemplate = {
        id: String(Date.now()),
        name,
        content,
        variables,
        isActive: true,
      };
      setTemplates([...templates, newTemplate]);
    } else if (editingTemplate) {
      const updatedTemplate: NotificationTemplate = {
        ...editingTemplate,
        name,
        content,
        variables,
      };
      setTemplates(
        templates.map(template =>
          template.id === editingTemplate.id ? updatedTemplate : template
        )
      );
    }

    setIsAdding(false);
    setEditingTemplate(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingTemplate(null);
  };

  return (
    <Container>
      <Header>
        <Title>{t('notifications.templates.title')}</Title>
        <Button onClick={handleAdd}>
          <FiPlus />
          {t('notifications.templates.add')}
        </Button>
      </Header>

      {(isAdding || editingTemplate) && (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">{t('notifications.templates.name')}</Label>
            <Input
              type="text"
              id="name"
              name="name"
              defaultValue={editingTemplate?.name}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="content">{t('notifications.templates.content')}</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={editingTemplate?.content}
              required
            />
          </FormGroup>
          <FormActions>
            <Button type="button" onClick={handleCancel}>
              <FiX />
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              <FiCheck />
              {t('common.save')}
            </Button>
          </FormActions>
        </Form>
      )}

      <TemplateList>
        {templates.map(template => (
          <TemplateItem
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TemplateHeader>
              <TemplateName>{template.name}</TemplateName>
              <Actions>
                <ActionButton onClick={() => handleEdit(template)}>
                  <FiEdit2 />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(template.id)}>
                  <FiTrash2 />
                </ActionButton>
              </Actions>
            </TemplateHeader>
            <Content>{template.content}</Content>
            <Variables>
              {template.variables.map(variable => (
                <Variable key={variable}>{variable}</Variable>
              ))}
            </Variables>
          </TemplateItem>
        ))}
      </TemplateList>
    </Container>
  );
};

export default NotificationTemplateManager; 