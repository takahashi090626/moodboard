import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

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

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 1rem;
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

const Header = () => {
  const { user } = useAuth();

  return (
    <HeaderWrapper>
      <Logo>MoodBoard 2.0</Logo>
      <NavMenu>
        <NavItem to="/">ホーム</NavItem>
        <NavItem to="/explore">探索</NavItem>
        <NavItem to="/notifications">お知らせ</NavItem>
        {user && (
          <Link to="/profile">
            <UserAvatar src={user.avatarUrl || '/default-avatar.png'} alt="User Avatar" />
          </Link>
        )}
      </NavMenu>
    </HeaderWrapper>
  );
};

export default Header;