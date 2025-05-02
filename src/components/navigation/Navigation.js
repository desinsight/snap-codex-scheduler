import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiCalendar, FiBell, FiPieChart, FiSettings, FiUser, FiMenu, FiX, FiClock, } from 'react-icons/fi';
const navItems = [
    { icon: _jsx(FiCalendar, {}), label: 'Calendar', path: '/calendar' },
    { icon: _jsx(FiBell, {}), label: 'Notifications', path: '/notifications' },
    { icon: _jsx(FiPieChart, {}), label: 'Analytics', path: '/analytics' },
    { icon: _jsx(FiSettings, {}), label: 'Settings', path: '/settings' },
    { icon: _jsx(FiUser, {}), label: 'Profile', path: '/profile' },
];
const NavContainer = styled.nav `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: ${({ theme }) => theme.colors.background.paper};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  z-index: 1000;
  padding: 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Logo = styled(Link) `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  font-weight: ${({ theme }) => theme.typography.h5.fontWeight};
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
`;
const DesktopNav = styled.div `
  display: none;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;
const NavLink = styled(Link) `
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  color: ${({ theme, active }) => (active ? theme.colors.primary.main : theme.colors.text.primary)};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transitions.duration.short}ms
    ${({ theme }) => theme.transitions.easing.easeInOut};
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grey[100]};
  }

  ${({ active, theme }) => active &&
    `
    background-color: ${theme.colors.primary.main}10;
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 2px;
      background-color: ${theme.colors.primary.main};
      border-radius: 2px;
    }
  `}
`;
const MobileMenuButton = styled.button `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
const MobileMenu = styled(motion.div) `
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.paper};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 999;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigationItems = [
        { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
        { path: '/schedule', icon: FiClock, label: 'Schedule' },
        { path: '/notifications', icon: FiBell, label: 'Notifications' },
        { path: '/analytics', icon: FiPieChart, label: 'Analytics' },
        { path: '/settings', icon: FiSettings, label: 'Settings' },
        { path: '/profile', icon: FiUser, label: 'Profile' },
    ];
    return (_jsxs(_Fragment, { children: [_jsxs(NavContainer, { children: [_jsxs(Logo, { to: "/", children: [_jsx(FiCalendar, { size: 24 }), _jsx("span", { children: "Scheduler" })] }), _jsx(DesktopNav, { children: navigationItems.map(item => (_jsxs(NavLink, { to: item.path, active: location.pathname === item.path, children: [_jsx(item.icon, { size: 20 }), _jsx("span", { children: item.label })] }, item.path))) }), _jsx(MobileMenuButton, { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), children: isMobileMenuOpen ? _jsx(FiX, { size: 24 }) : _jsx(FiMenu, { size: 24 }) })] }), _jsx(AnimatePresence, { children: isMobileMenuOpen && (_jsx(MobileMenu, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.2 }, children: navigationItems.map(item => (_jsxs(NavLink, { to: item.path, active: location.pathname === item.path, onClick: () => setIsMobileMenuOpen(false), children: [_jsx(item.icon, { size: 20 }), _jsx("span", { children: item.label })] }, item.path))) })) })] }));
};
export default Navigation;
