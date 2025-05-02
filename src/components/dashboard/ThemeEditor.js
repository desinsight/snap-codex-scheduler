import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
const Modal = styled.div `
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
const Container = styled.div `
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;
const Title = styled.h2 `
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.colors.text};
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
const Section = styled.div `
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const SectionTitle = styled.h3 `
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.medium};
`;
const FormGroup = styled.div `
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const Label = styled.label `
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;
const Input = styled.input `
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
const ColorInput = styled(Input) `
  width: 100px;
  padding: 4px;
  height: 40px;
`;
const ButtonGroup = styled.div `
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;
const Button = styled.button `
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, variant }) => variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const PreviewContainer = styled.div `
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 16px;
  margin-top: 16px;
`;
const defaultTheme = {
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
const ThemeEditor = ({ theme: initialTheme, onSave, onClose }) => {
    const { t } = useTranslation();
    const [theme, setTheme] = useState(initialTheme || defaultTheme);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(theme);
    };
    const handleColorChange = (key) => (e) => {
        setTheme({
            ...theme,
            colors: {
                ...theme.colors,
                [key]: e.target.value
            }
        });
    };
    const handleFontFamilyChange = (e) => {
        setTheme({
            ...theme,
            typography: {
                ...theme.typography,
                fontFamily: e.target.value
            }
        });
    };
    return (_jsx(Modal, { onClick: onClose, children: _jsxs(Container, { onClick: e => e.stopPropagation(), children: [_jsx(Title, { children: t('dashboard.theme.customize') }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(Section, { children: [_jsx(SectionTitle, { children: t('dashboard.theme.colors') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.primary') }), _jsx(ColorInput, { type: "color", value: theme.colors.primary, onChange: handleColorChange('primary') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.secondary') }), _jsx(ColorInput, { type: "color", value: theme.colors.secondary, onChange: handleColorChange('secondary') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.background') }), _jsx(ColorInput, { type: "color", value: theme.colors.background, onChange: handleColorChange('background') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.surface') }), _jsx(ColorInput, { type: "color", value: theme.colors.surface, onChange: handleColorChange('surface') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.text') }), _jsx(ColorInput, { type: "color", value: theme.colors.text, onChange: handleColorChange('text') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.border') }), _jsx(ColorInput, { type: "color", value: theme.colors.border, onChange: handleColorChange('border') })] })] }), _jsxs(Section, { children: [_jsx(SectionTitle, { children: t('dashboard.theme.typography') }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('dashboard.theme.fontFamily') }), _jsx(Input, { type: "text", value: theme.typography.fontFamily, onChange: handleFontFamilyChange })] })] }), _jsxs(PreviewContainer, { style: {
                                backgroundColor: theme.colors.background,
                                color: theme.colors.text,
                                fontFamily: theme.typography.fontFamily
                            }, children: [_jsx("div", { style: { fontSize: theme.typography.fontSize.large }, children: t('dashboard.theme.previewTitle') }), _jsx("div", { style: { fontSize: theme.typography.fontSize.medium, marginTop: theme.spacing.medium }, children: t('dashboard.theme.previewText') }), _jsxs("div", { style: {
                                        backgroundColor: theme.colors.surface,
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: '4px',
                                        padding: theme.spacing.medium,
                                        marginTop: theme.spacing.medium
                                    }, children: [_jsx("div", { style: { color: theme.colors.primary }, children: t('dashboard.theme.previewPrimary') }), _jsx("div", { style: { color: theme.colors.secondary }, children: t('dashboard.theme.previewSecondary') })] })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { type: "button", variant: "secondary", onClick: onClose, children: t('common.cancel') }), _jsx(Button, { type: "submit", children: t('common.save') })] })] })] }) }));
};
export default ThemeEditor;
