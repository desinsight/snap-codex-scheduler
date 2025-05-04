import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { rippleAnimation } from './animations';

type ButtonVariant = 'contained' | 'outlined' | 'text';
type ButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

interface RippleProps {
  size: number;
  x: number;
  y: number;
}

const rippleAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const StyledButton = styled(motion.button)<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ size = 'medium' }) =>
    size === 'small'
      ? '6px 16px'
      : size === 'large'
      ? '12px 24px'
      : '8px 20px'};
  font-size: ${({ size = 'medium', theme }) =>
    size === 'small'
      ? theme.typography.sizes.sm
      : size === 'large'
      ? theme.typography.sizes.lg
      : theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all ${({ theme }) => theme.transitions.duration.standard}ms ${({ theme }) => theme.transitions.easing.easeInOut};
  overflow: hidden;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};

  ${({ variant = 'contained', color = 'primary', theme }) => {
    const colors = theme.colors[color];

    switch (variant) {
      case 'outlined':
        return css`
          color: ${colors.main};
          border: 1px solid ${colors.main};
          background: transparent;

          &:hover {
            background: ${colors.main}10;
          }

          &:active {
            background: ${colors.main}20;
          }

          &:disabled {
            color: ${theme.colors.text.disabled};
            border-color: ${theme.colors.text.disabled};
            background: transparent;
          }
        `;
      case 'text':
        return css`
          color: ${colors.main};
          background: transparent;
          border: none;

          &:hover {
            background: ${colors.main}10;
          }

          &:active {
            background: ${colors.main}20;
          }

          &:disabled {
            color: ${theme.colors.text.disabled};
            background: transparent;
          }
        `;
      default:
        return css`
          color: ${colors.contrastText};
          background: ${colors.main};
          border: none;

          &:hover {
            background: ${colors.dark};
          }

          &:active {
            background: ${colors.light};
          }

          &:disabled {
            background: ${theme.colors.grey[300]};
          }
        `;
    }
  }}
`;

const RippleEffect = styled.span<RippleProps>`
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  pointer-events: none;
  animation: ${rippleAnimation} 0.6s linear;
  background-color: rgba(255, 255, 255, 0.7);
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid;
  border-color: currentColor transparent currentColor transparent;
  border-radius: 50%;
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleProps[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    setRipples([...ripples, { size, x, y }]);
    onClick?.(event);

    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  };

  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {!loading && startIcon}
      {!loading && children}
      {!loading && endIcon}
      {ripples.map((ripple, i) => (
        <RippleEffect key={i} {...ripple} />
      ))}
    </StyledButton>
  );
};

export default Button;
