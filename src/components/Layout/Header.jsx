import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { FaBell } from 'react-icons/fa';
import { getNotifications } from '../../services/userService';
import NotificationBox from '../NotificationBox';
import { doc, onSnapshot } from 'firebase/firestore';

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
  const [avatarUrl, setAvatarUrl] = useState('/default-avatar.png');

  useEffect(() => {
    let unsubscribe;

    const fetchUserData = async () => {
      if (user && user.uid) {
        // Firestoreからユーザーデータを取得し、リアルタイムで更新を監視
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            if (userData.avatarURL) {
              setAvatarUrl(userData.avatarURL);
            } else if (user.photoURL) {
              setAvatarUrl(user.photoURL);
            } else {
              setAvatarUrl('/default-avatar.png');
            }
          } else {
            setAvatarUrl('/default-avatar.png');
          }
        }, (error) => {
          console.error("Error fetching user data:", error);
          setAvatarUrl('/default-avatar.png');
        });

        // 通知の取得
        try {
          const userNotifications = await getNotifications(user.uid);
          setNotifications(userNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setNotifications([]);
        }
      } else {
        setAvatarUrl('/default-avatar.png');
      }
    };

    fetchUserData();

    const notificationInterval = setInterval(() => {
      if (user && user.uid) {
        getNotifications(user.uid)
          .then(setNotifications)
          .catch(error => {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
          });
      }
    }, 60000); // 1分ごとに更新

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearInterval(notificationInterval);
    };
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
              <UserAvatar src={avatarUrl} alt="User avatar" onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.png'; }} />
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