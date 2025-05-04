import React from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { IoClose } from 'react-icons/io5';
import { IoMdCheckmarkCircle } from 'react-icons/io';

const NotificationContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  position: fixed;
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.snackbar};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NotificationTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.h4.fontSize};
  font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.divider};
  width: 300px;

  input {
    border: none;
    background: none;
    flex: 1;
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.body2.fontSize};
    color: ${({ theme }) => theme.colors.text.primary};

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }

  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NotificationItem = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 300px;
  max-width: 500px;
`;

const NotificationItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NotificationTitleText = styled.h3`
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme, read }) => (read ? 400 : 600)};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const NotificationTimestamp = styled.span`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NotificationMessage = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NotificationActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NotificationTypeBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  margin-right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, type }) => theme.colors[type].main}20;
  color: ${({ theme, type }) => theme.colors[type].main};
`;

const NotificationModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.shape.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  width: 90%;
  max-width: 600px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SuccessIcon = styled(IoMdCheckmarkCircle)`
  color: ${({ theme }) => theme.colors.success.main};
  font-size: 24px;
`;

const Notification = ({ notifications, onClose }) => {
  return (
    <NotificationContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <SuccessIcon />
            <NotificationContent>
              <NotificationTitle>{notification.title}</NotificationTitle>
              {notification.message && (
                <NotificationMessage>{notification.message}</NotificationMessage>
              )}
            </NotificationContent>
            <CloseButton onClick={() => onClose(notification.id)}>
              <IoClose size={20} />
            </CloseButton>
          </NotificationItem>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

export default Notification;
