import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Form = styled.form`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
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

const TextArea = styled.textarea`
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

const RatingContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RatingButton = styled.button<{ selected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid
    ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.background};
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

const SubmitButton = styled.button`
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

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

interface FeedbackFormProps {
  onSubmit: (feedback: { rating: number; comment: string; email?: string }) => Promise<void>;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      setError(t('feedback.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} aria-labelledby="feedback-title">
      <Title id="feedback-title">{t('feedback.title')}</Title>

      <FormGroup>
        <Label htmlFor="rating">{t('feedback.rating')}</Label>
        <RatingContainer role="radiogroup" aria-label={t('feedback.rating')}>
          {[1, 2, 3, 4, 5].map(value => (
            <RatingButton
              key={value}
              type="button"
              selected={rating === value}
              onClick={() => setRating(value)}
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} ${t('feedback.stars')}`}
            >
              {value}
            </RatingButton>
          ))}
        </RatingContainer>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="comment">{t('feedback.comment')}</Label>
        <TextArea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
          aria-required="true"
          aria-label={t('feedback.comment')}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">{t('feedback.email')}</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          aria-label={t('feedback.email')}
        />
      </FormGroup>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
      {success && <SuccessMessage role="status">{success}</SuccessMessage>}

      <SubmitButton
        type="submit"
        disabled={isSubmitting || !rating || !comment}
        aria-label={t('feedback.submit')}
      >
        {isSubmitting ? t('feedback.submitting') : t('feedback.submit')}
      </SubmitButton>
    </Form>
  );
};
