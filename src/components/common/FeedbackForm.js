import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
const Form = styled.form `
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;
const Title = styled.h2 `
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;
const FormGroup = styled.div `
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const Label = styled.label `
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;
const Input = styled.input `
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const TextArea = styled.textarea `
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const RatingContainer = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
const RatingButton = styled.button `
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, selected }) => (selected ? 'white' : theme.colors.text)};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
const SubmitButton = styled.button `
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;
const ErrorMessage = styled.div `
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
const SuccessMessage = styled.div `
  color: ${({ theme }) => theme.colors.success};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
export const FeedbackForm = ({ onSubmit }) => {
    const { t } = useTranslation('common');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
        try {
            await onSubmit({ rating, comment, email });
            setSuccess(t('feedback.success'));
            setRating(0);
            setComment('');
            setEmail('');
        }
        catch (err) {
            setError(t('feedback.error'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs(Form, { onSubmit: handleSubmit, "aria-labelledby": "feedback-title", children: [_jsx(Title, { id: "feedback-title", children: t('feedback.title') }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "rating", children: t('feedback.rating') }), _jsx(RatingContainer, { role: "radiogroup", "aria-label": t('feedback.rating'), children: [1, 2, 3, 4, 5].map(value => (_jsx(RatingButton, { type: "button", selected: rating === value, onClick: () => setRating(value), role: "radio", "aria-checked": rating === value, "aria-label": `${value} ${t('feedback.stars')}`, children: value }, value))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "comment", children: t('feedback.comment') }), _jsx(TextArea, { id: "comment", value: comment, onChange: e => setComment(e.target.value), required: true, "aria-required": "true", "aria-label": t('feedback.comment') })] }), _jsxs(FormGroup, { children: [_jsx(Label, { htmlFor: "email", children: t('feedback.email') }), _jsx(Input, { type: "email", id: "email", value: email, onChange: e => setEmail(e.target.value), "aria-label": t('feedback.email') })] }), error && _jsx(ErrorMessage, { role: "alert", children: error }), success && _jsx(SuccessMessage, { role: "status", children: success }), _jsx(SubmitButton, { type: "submit", disabled: isSubmitting || !rating || !comment, "aria-label": t('feedback.submit'), children: isSubmitting ? t('feedback.submitting') : t('feedback.submit') })] }));
};
