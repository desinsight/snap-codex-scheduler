import styled, { css } from 'styled-components';
import React from 'react';
import { Spinner } from './LoadingSpinner';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const getButtonSize = (size: ButtonSize) => {
  const sizes = {
    sm: css`
      padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
      font-size: ${({ theme }) => theme.fontSizes.sm};
    `,
    md: css`
      padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
      font-size: ${({ theme }) => theme.fontSizes.md};
    `,
    lg: css`
      padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
      font-size: ${({ theme }) => theme.fontSizes.lg};
    `,
  };
  return sizes[size];
};

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xs};
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;

  ${({ variant = 'primary', theme }) => {
    const variants = {
      primary: css`
        background: ${theme.colors.gradient.primary};
        color: white;
        border: none;
        &:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `,
      secondary: css`
        background: ${theme.colors.gradient.success};
        color: white;
        border: none;
        &:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.md};
        }
      `,
      outline: css`
        background: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        &:hover {
          background: ${theme.colors.primary}10;
        }
      `,
      ghost: css`
        background: transparent;
        color: ${theme.colors.text.primary};
        border: none;
        &:hover {
          background: ${theme.colors.text.primary}10;
        }
      `,
    };
    return variants[variant];
  }}

  ${({ size = 'md' }) => getButtonSize(size)}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  ${({ isLoading }) => isLoading && css`
    color: transparent !important;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  `}
`;

const Button: React.FC<ButtonProps> = ({ 
  children, 
  isLoading, 
  icon,
  ...props 
}) => {
  return (
    <StyledButton isLoading={isLoading} {...props}>
      {isLoading && <Spinner size="sm" />}
      {!isLoading && icon}
      {children}
    </StyledButton>
  );
};

export default Button; 