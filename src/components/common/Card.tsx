import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

type CardVariant = 'elevation' | 'outlined';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  elevation?: 1 | 2 | 3;
  noPadding?: boolean;
  fullWidth?: boolean;
  clickable?: boolean;
  selected?: boolean;
}

const getElevation = (elevation: number) => {
  switch (elevation) {
    case 1:
      return css`
        box-shadow: ${({ theme }) => theme.shadows.small};
      `;
    case 2:
      return css`
        box-shadow: ${({ theme }) => theme.shadows.medium};
      `;
    case 3:
      return css`
        box-shadow: ${({ theme }) => theme.shadows.large};
      `;
    default:
      return css`
        box-shadow: ${({ theme }) => theme.shadows.small};
      `;
  }
};

const StyledCard = styled(motion.div)<CardProps>`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ noPadding }) => (noPadding ? '0' : '1rem')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  transition: all ${({ theme }) => theme.transitions.short};

  ${({ variant = 'elevation', elevation = 1 }) =>
    variant === 'elevation'
      ? getElevation(elevation)
      : css`
          border: 1px solid ${({ theme }) => theme.colors.grey[200]};
        `}

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        ${({ variant = 'elevation' }) =>
          variant === 'elevation' &&
          css`
            box-shadow: ${({ theme }) => theme.shadows.medium};
          `}
      }
    `}

  ${({ selected }) =>
    selected &&
    css`
      border: 2px solid ${({ theme }) => theme.colors.primary.main};
    `}
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey[200]};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
`;

const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.grey[200]};
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  ${({ theme }) => theme.typography.h5};
`;

const CardSubtitle = styled.h4`
  margin: ${({ theme }) => `${theme.spacing(1)} 0 0`};
  color: ${({ theme }) => theme.colors.text.secondary};
  ${({ theme }) => theme.typography.body2};
`;

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
} = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle; 