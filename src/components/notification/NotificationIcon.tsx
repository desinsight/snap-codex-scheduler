import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NotificationService from '../../services/NotificationService';
import NotificationCenter from './NotificationCenter';

const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.surface};
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    const updateUnreadCount = () => {
      setUnreadCount(notificationService.getUnreadCount());
    };

    updateUnreadCount();
    // 실제 구현에서는 웹소켓이나 폴링을 통해 실시간 업데이트
    const interval = setInterval(updateUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <IconContainer onClick={() => setIsOpen(true)}>
        <Icon>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Icon>
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </IconContainer>
      <NotificationCenter isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default NotificationIcon;
