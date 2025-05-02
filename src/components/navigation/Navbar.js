import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled, { css } from 'styled-components';
import Button from '../common/Button';
const MOBILE_BREAKPOINT = '768px';
const NavContainer = styled.nav `
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;
const NavContent = styled.div `
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: relative;
  }
`;
const Logo = styled.h1 `
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  margin: 0;

  span {
    background: ${({ theme }) => theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
const NavActions = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  align-items: center;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: absolute;
    top: 100%;
    right: 0;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.surface};
    padding: ${({ theme }) => theme.space.md};
    border-radius: ${({ theme }) => theme.radii.lg};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    min-width: 200px;
    transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-10px')});
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;
const NavLinks = styled.div `
  display: flex;
  gap: ${({ theme }) => theme.space.lg};
  margin-right: ${({ theme }) => theme.space.xl};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.md};
    margin-right: 0;
    width: 100%;
  }
`;
const NavLink = styled.a `
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.text.secondary)};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ active }) => (active ? 600 : 400)};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;
  padding: ${({ theme }) => theme.space.xs} 0;

  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    opacity: ${({ active }) => (active ? 1 : 0)};
    transition: ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    &:after {
      opacity: 0.5;
    }
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
    padding: ${({ theme }) => theme.space.sm};
    border-radius: ${({ theme }) => theme.radii.sm};

    &:after {
      display: none;
    }

    &:hover {
      background: ${({ theme }) => theme.colors.background};
    }

    ${({ active, theme }) => active &&
    css `
        background: ${theme.colors.primary}10;
      `}
  }
`;
const MenuButton = styled.button `
  display: none;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.space.sm};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const MenuIcon = styled.div `
  width: 24px;
  height: 2px;
  background: ${({ theme }) => theme.colors.text.primary};
  position: relative;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ isOpen }) => isOpen &&
    css `
      background: transparent;
    `}

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: ${({ theme }) => theme.colors.text.primary};
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  &:before {
    top: ${({ isOpen }) => (isOpen ? '0' : '-8px')};
    transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'none')};
  }

  &:after {
    bottom: ${({ isOpen }) => (isOpen ? '0' : '-8px')};
    transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'none')};
  }
`;
const MobileOverlay = styled.div `
  display: none;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: all ${({ theme }) => theme.transitions.fast};
  }
`;
export const Navbar = ({ onCreateSchedule, currentPath = '/dashboard' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx(NavContainer, { children: _jsxs(NavContent, { children: [_jsxs(Logo, { children: ["Snap", _jsx("span", { children: "Codex" })] }), _jsx(MenuButton, { onClick: toggleMenu, children: _jsx(MenuIcon, { isOpen: isMenuOpen }) }), _jsxs(NavActions, { isOpen: isMenuOpen, children: [_jsxs(NavLinks, { children: [_jsx(NavLink, { href: "/dashboard", active: currentPath === '/dashboard', children: "Dashboard" }), _jsx(NavLink, { href: "/calendar", active: currentPath === '/calendar', children: "Calendar" }), _jsx(NavLink, { href: "/analytics", active: currentPath === '/analytics', children: "Analytics" }), _jsx(NavLink, { href: "/settings", active: currentPath === '/settings', children: "Settings" })] }), _jsx(Button, { variant: "primary", onClick: () => {
                                        onCreateSchedule?.();
                                        closeMenu();
                                    }, fullWidth: window.innerWidth <= 768, children: "+ New Schedule" })] })] }) }), _jsx(MobileOverlay, { isOpen: isMenuOpen, onClick: closeMenu })] }));
};
