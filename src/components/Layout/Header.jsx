import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

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

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <HeaderWrapper>
      <Logo to="/">MoodBoard 2.0</Logo>
      <NavMenu>
        {user && (
          <>
            <NavItem to="/">ホーム</NavItem>
            <NavItem to="/explore">探索</NavItem>
            <NavItem to="/notification">お知らせ</NavItem>
            <Link to="/profile">
              <UserAvatar src={user.avatarUrl || '/default-avatar.png'}  />
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