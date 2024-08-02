import React from 'react';
import { acceptFriendRequest, rejectFriendRequest, markNotificationAsRead } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserFriends, FaHeart, FaComment } from 'react-icons/fa';

const NotificationContainer = styled.div`
  padding: 10px;
`;

const NotificationHeader = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const NotificationItem = styled(motion.div)`
  background-color: ${props => props.isRead ? '#f0f2f5' : '#e7f3ff'};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.isRead ? '#e4e6eb' : '#d0e8ff'};
  }
`;

const NotificationText = styled.p`
  margin: 0;
  color: #1c1e21;
  font-size: 13px;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
`;

const NotificationTime = styled.span`
  color: #65676b;
  font-size: 11px;
`;

const NotificationAction = styled.button`
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #166fe5;
  }
`;

const NotificationIcon = styled.span`
  margin-right: 8px;
  color: ${props => {
    switch(props.type) {
      case 'friendRequest': return '#1877f2';
      case 'like': return '#e41e3f';
      case 'comment': return '#f7b928';
      default: return '#333';
    }
  }};
`;

function NotificationBox({ notifications, setNotifications }) {
  const { user } = useAuth();

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleAccept = async (requestId, friendId) => {
    await acceptFriendRequest(requestId, user.uid, friendId);
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== requestId)
    );
  };

  const handleReject = async (requestId) => {
    await rejectFriendRequest(requestId);
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== requestId)
    );
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'friendRequest': return <FaUserFriends />;
      case 'like': return <FaHeart />;
      case 'comment': return <FaComment />;
      default: return null;
    }
  };
  if (!notifications || notifications.length === 0) {
    return (
      <NotificationContainer>
        <NotificationHeader>Notifications</NotificationHeader>
        <p>No new notifications</p>
      </NotificationContainer>
    );
  }

  return (
    <NotificationContainer>
      <NotificationHeader>Notifications</NotificationHeader>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            isRead={notification.isRead}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NotificationText>
              <NotificationIcon type={notification.type}>
                {getNotificationIcon(notification.type)}
              </NotificationIcon>
              {notification.content}
            </NotificationText>
            <NotificationMeta>
              <NotificationTime>{new Date(notification.createdAt.seconds * 1000).toLocaleString()}</NotificationTime>
              {notification.type === 'friendRequest' ? (
                <>
                  <NotificationAction onClick={() => handleAccept(notification.id, notification.sender)}>
                    Accept
                  </NotificationAction>
                  <NotificationAction onClick={() => handleReject(notification.id)}>
                    Reject
                  </NotificationAction>
                </>
              ) : (
                !notification.isRead && (
                  <NotificationAction onClick={() => handleMarkAsRead(notification.id)}>
                    Mark as Read
                  </NotificationAction>
                )
              )}  
            </NotificationMeta>
          </NotificationItem>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
}

export default NotificationBox;