import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { FaBell } from 'react-icons/fa';
import { getNotifications } from '../../services/userService';
import NotificationBox from '../NotificationBox';

const HeaderWrapper = styled.header`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  background-color: #e94560;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d63447;
    transform: translateY(-2px);
  }
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e94560;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
`;

const NotificationPopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const userNotifications = await getNotifications(user.uid);
        setNotifications(userNotifications);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <HeaderWrapper>
      <Logo to="/">MoodBoard 2.0</Logo>
      <NavMenu>
        {user && (
          <>
            <NavItem to="/">ホーム</NavItem>
            <NavItem to="/search">検索</NavItem>
            <NavItem to="/friends">フレンド一覧</NavItem>
            <NotificationIcon onClick={toggleNotifications}>
              <FaBell color="white" size={20} />
              {unreadCount > 0 && <NotificationCount>{unreadCount}</NotificationCount>}
            </NotificationIcon>
            {showNotifications && (
              <NotificationPopup>
                <NotificationBox notifications={notifications} setNotifications={setNotifications} />
              </NotificationPopup>
            )}
            <Link to="/profile">
              <UserAvatar src={user.avatarUrl || '/default-avatar.png'} />
            </Link>
            <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
          </>
        )}
        {!user && (
          <>
            <NavItem to="/login">ログイン</NavItem>
            <NavItem to="/register">新規登録</NavItem>
          </>
        )}
      </NavMenu>
    </HeaderWrapper>
  );
}

export default Header;