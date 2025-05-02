import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { ButtonProps } from '../../types/props';

type ButtonVariant = 'contained' | 'outlined' | 'text';
type ButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const getButtonStyles = (variant: ButtonVariant, color: ButtonColor, theme: any) => {
  const colorObj = theme.colors[color];

  switch (variant) {
    case 'contained':
      return css`
        background-color: ${colorObj.main};
        color: white;
        border: none;

        &:hover {
          background-color: ${colorObj.dark};
        }

        &:active {
          background-color: ${colorObj.light};
        }

        &:disabled {
          background-color: ${theme.colors.grey[300]};
          color: ${theme.colors.grey[500]};
        }
      `;
    case 'outlined':
      return css`
        background-color: transparent;
        color: ${colorObj.main};
        border: 1px solid ${colorObj.main};

        &:hover {
          background-color: ${colorObj.light}20;
        }

        &:active {
          background-color: ${colorObj.light}40;
        }

        &:disabled {
          border-color: ${theme.colors.grey[300]};
          color: ${theme.colors.grey[500]};
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${colorObj.main};
        border: none;

        &:hover {
          background-color: ${colorObj.light}20;
        }

        &:active {
          background-color: ${colorObj.light}40;
        }

        &:disabled {
          color: ${theme.colors.grey[500]};
        }
      `;
    default:
      return '';
  }
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 6px 16px;
        font-size: 0.875rem;
      `;
    case 'large':
      return css`
        padding: 12px 32px;
        font-size: 1.125rem;
      `;
    default:
      return css`
        padding: 8px 24px;
        font-size: 1rem;
      `;
  }
};

const StyledButton = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: 500;
  transition: all ${({ theme }) => theme.transitions.short};
  cursor: pointer;
  outline: none;
  position: relative;
  overflow: hidden;

  ${({ variant = 'contained', color = 'primary', theme }) => getButtonStyles(variant, color, theme)}
  ${({ size = 'medium' }) => getButtonSize(size)}
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    cursor: not-allowed;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms linear;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  loading = false,
  disabled,
  onClick,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled || !onClick) return;

    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
    onClick(event);
  };

  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && startIcon}
      {children}
      {!loading && endIcon}
    </StyledButton>
  );
};

export default Button;
