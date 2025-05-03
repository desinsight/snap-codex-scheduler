import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  elevation?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  clickable?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

interface CardComposition {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
}

const StyledCard = styled(motion.div)<CardProps>`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  overflow: hidden;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  ${({ elevation, theme }) => {
    switch (elevation) {
      case 'sm':
        return css`
          box-shadow: ${theme.shadows.sm};
        `;
      case 'md':
        return css`
          box-shadow: ${theme.shadows.md};
        `;
      case 'lg':
        return css`
          box-shadow: ${theme.shadows.lg};
        `;
      case 'xl':
        return css`
          box-shadow: ${theme.shadows.xl};
        `;
      default:
        return css`
          box-shadow: ${theme.shadows.sm};
        `;
    }
  }}

  ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return css`
          padding: 0;
        `;
      case 'sm':
        return css`
          padding: ${theme.spacing.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.lg};
        `;
      default:
        return css`
          padding: ${theme.spacing.md};
        `;
    }
  }}

  ${({ clickable, theme }) =>
    clickable &&
    css`
      cursor: pointer;
      transition:
        transform ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut},
        box-shadow ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut};

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
      }

      &:active {
        transform: translateY(0);
        box-shadow: ${theme.shadows.md};
      }
    `}
`;

const CardHeader = styled.div<{ padding?: CardProps['padding'] }>`
  padding: ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }};
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider};
`;

const CardContent = styled.div<{ padding?: CardProps['padding'] }>`
  padding: ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }};
`;

const CardFooter = styled.div<{ padding?: CardProps['padding'] }>`
  padding: ${({ padding, theme }) => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  }};
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
`;

const Card: React.FC<CardProps> & CardComposition = ({
  children,
  elevation = 'sm',
  padding = 'md',
  clickable = false,
  fullWidth = false,
  onClick,
  ...props
}) => {
  return (
    <StyledCard
      elevation={elevation}
      padding={padding}
      clickable={clickable}
      fullWidth={fullWidth}
      onClick={onClick}
      whileHover={clickable ? { scale: 1.01 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
