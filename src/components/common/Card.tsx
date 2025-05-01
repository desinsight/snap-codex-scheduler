import styled, { css } from 'styled-components';
import React from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const CardContainer = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ variant = 'default', theme }) => {
    const variants = {
      default: css`
        box-shadow: ${theme.shadows.sm};
      `,
      elevated: css`
        box-shadow: ${theme.shadows.lg};
      `,
      outlined: css`
        border: 1px solid ${theme.colors.text.tertiary}20;
      `,
    };
    return variants[variant];
  }}

  ${({ interactive, theme }) =>
    interactive &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.lg};
      }
      &:active {
        transform: translateY(-2px);
      }
    `}
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.tertiary}10;
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.space.lg};
`;

const CardFooter = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.text.tertiary}10;
  background: ${({ theme }) => theme.colors.background};
`;

const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'default',
  interactive = false,
  ...props
}) => {
  return (
    <CardContainer variant={variant} interactive={interactive} {...props}>
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};

export default Card; 