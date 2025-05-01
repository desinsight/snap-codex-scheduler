import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';

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
}

interface RippleProps {
  x: number;
  y: number;
  size: number;
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
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  font-size: ${({ theme }) => theme.typography.button.fontSize};
  line-height: ${({ theme }) => theme.typography.button.lineHeight};
  transition: all ${({ theme }) => theme.transitions.duration.short}ms ${({ theme }) => theme.transitions.easing.easeInOut};
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

  ${({ size, theme }) => {
    switch (size) {
      case 'small':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          min-height: 32px;
        `;
      case 'large':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          min-height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          min-height: 40px;
        `;
    }
  }}

  ${({ variant, color = 'primary', theme }) => {
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
            cursor: not-allowed;
          }
        `;
      case 'text':
        return css`
          color: ${colors.main};
          background: transparent;

          &:hover {
            background: ${colors.main}10;
          }

          &:active {
            background: ${colors.main}20;
          }

          &:disabled {
            color: ${theme.colors.text.disabled};
            background: transparent;
            cursor: not-allowed;
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
            cursor: not-allowed;
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

  useEffect(() => {
    const cleanup = ripples.reduce((acc, _, index) => {
      const timer = setTimeout(() => {
        setRipples(prev => prev.filter((_, i) => i !== index));
      }, 600);
      return [...acc, timer];
    }, [] as number[]);

    return () => cleanup.forEach(timer => clearTimeout(timer));
  }, [ripples]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(button.clientWidth, button.clientHeight);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      setRipples(prev => [...prev, { x, y, size }]);
      onClick?.(event);
    }
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
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {!loading && startIcon}
      {!loading && children}
      {!loading && endIcon}
      {ripples.map((ripple, index) => (
        <RippleEffect key={index} {...ripple} />
      ))}
    </StyledButton>
  );
};

export default Button; 