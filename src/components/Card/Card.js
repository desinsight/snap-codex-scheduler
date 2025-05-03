import { jsx as _jsx } from "react/jsx-runtime";
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
const StyledCard = styled(motion.div) `
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  overflow: hidden;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  ${({ elevation, theme }) => {
    switch (elevation) {
        case 'sm':
            return css `
          box-shadow: ${theme.shadows.sm};
        `;
        case 'md':
            return css `
          box-shadow: ${theme.shadows.md};
        `;
        case 'lg':
            return css `
          box-shadow: ${theme.shadows.lg};
        `;
        case 'xl':
            return css `
          box-shadow: ${theme.shadows.xl};
        `;
        default:
            return css `
          box-shadow: ${theme.shadows.sm};
        `;
    }
}}

  ${({ padding, theme }) => {
    switch (padding) {
        case 'none':
            return css `
          padding: 0;
        `;
        case 'sm':
            return css `
          padding: ${theme.spacing.sm};
        `;
        case 'lg':
            return css `
          padding: ${theme.spacing.lg};
        `;
        default:
            return css `
          padding: ${theme.spacing.md};
        `;
    }
}}

  ${({ clickable, theme }) => clickable &&
    css `
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
const CardHeader = styled.div `
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
const CardContent = styled.div `
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
const CardFooter = styled.div `
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
const Card = ({ children, elevation = 'sm', padding = 'md', clickable = false, fullWidth = false, onClick, ...props }) => {
    return (_jsx(StyledCard, { elevation: elevation, padding: padding, clickable: clickable, fullWidth: fullWidth, onClick: onClick, whileHover: clickable ? { scale: 1.01 } : undefined, whileTap: clickable ? { scale: 0.99 } : undefined, ...props, children: children }));
};
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
export default Card;
