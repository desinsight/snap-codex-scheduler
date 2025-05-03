import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ThemeConfig } from '../../types/dashboard';

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
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
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

const ColorInput = styled(Input)`
  width: 100px;
  padding: 4px;
  height: 40px;
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

const PreviewContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 16px;
  margin-top: 16px;
`;

const PreviewTitle = styled.div<{ fontSize: string }>`
  font-size: ${({ fontSize }) => fontSize};
`;

const PreviewText = styled.div<{ fontSize: string; marginTop: string }>`
  font-size: ${({ fontSize }) => fontSize};
  margin-top: ${({ marginTop }) => marginTop};
`;

const PreviewBox = styled.div<{ backgroundColor: string; borderColor: string; spacing: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 4px;
  padding: ${({ spacing }) => spacing};
  margin-top: ${({ spacing }) => spacing};
`;

const PreviewPrimary = styled.div<{ color: string }>`
  color: ${({ color }) => color};
`;

const PreviewSecondary = styled.div<{ color: string }>`
  color: ${({ color }) => color};
`;

interface Props {
  theme?: ThemeConfig;
  onSave: (theme: ThemeConfig) => void;
  onClose: () => void;
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    background: '#F3F4F6',
    surface: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB'
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem'
    }
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem'
  }
};

const ThemeEditor: React.FC<Props> = ({ theme: initialTheme, onSave, onClose }) => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme || defaultTheme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(theme);
  };

  const handleColorChange = (key: keyof typeof theme.colors) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTheme({
      ...theme,
      colors: {
        ...theme.colors,
        [key]: e.target.value
      }
    });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({
      ...theme,
      typography: {
        ...theme.typography,
        fontFamily: e.target.value
      }
    });
  };

  return (
    <Modal onClick={onClose}>
      <Container onClick={e => e.stopPropagation()}>
        <Title>{t('dashboard.theme.customize')}</Title>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>{t('dashboard.theme.colors')}</SectionTitle>
            <FormGroup>
              <Label>{t('dashboard.theme.primary')}</Label>
              <ColorInput
                type="color"
                value={theme.colors.primary}
                onChange={handleColorChange('primary')}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('dashboard.theme.secondary')}</Label>
              <ColorInput
                type="color"
                value={theme.colors.secondary}
                onChange={handleColorChange('secondary')}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('dashboard.theme.background')}</Label>
              <ColorInput
                type="color"
                value={theme.colors.background}
                onChange={handleColorChange('background')}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('dashboard.theme.surface')}</Label>
              <ColorInput
                type="color"
                value={theme.colors.surface}
                onChange={handleColorChange('surface')}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('dashboard.theme.text')}</Label>
              <ColorInput
                type="color"
                value={theme.colors.text}
                onChange={handleColorChange('text')}
              />
            </FormGroup>
            <FormGroup>
              <Label>{t('dashboard.theme.border')}</Label>
              <ColorInput
                type="color"
                value={theme.colors.border}
                onChange={handleColorChange('border')}
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>{t('dashboard.theme.typography')}</SectionTitle>
            <FormGroup>
              <Label>{t('dashboard.theme.fontFamily')}</Label>
              <Input
                type="text"
                value={theme.typography.fontFamily}
                onChange={handleFontFamilyChange}
              />
            </FormGroup>
          </Section>

          <PreviewContainer style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily
          }}>
            <PreviewTitle fontSize={theme.typography.fontSize.large}>
              {t('dashboard.theme.previewTitle')}
            </PreviewTitle>
            <PreviewText 
              fontSize={theme.typography.fontSize.medium}
              marginTop={theme.spacing.medium}
            >
              {t('dashboard.theme.previewText')}
            </PreviewText>
            <PreviewBox
              backgroundColor={theme.colors.surface}
              borderColor={theme.colors.border}
              spacing={theme.spacing.medium}
            >
              <PreviewPrimary color={theme.colors.primary}>
                {t('dashboard.theme.previewPrimary')}
              </PreviewPrimary>
              <PreviewSecondary color={theme.colors.secondary}>
                {t('dashboard.theme.previewSecondary')}
              </PreviewSecondary>
            </PreviewBox>
          </PreviewContainer>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </ButtonGroup>
        </Form>
      </Container>
    </Modal>
  );
};

export default ThemeEditor; 