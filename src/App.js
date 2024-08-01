import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalStyle, AppContainer } from './styles/StyledComponents';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Notification from './pages/Notifications';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostDetail from './components/Post/PostDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SearchPage  from './pages/SearchPage';
import UserProfile from './pages/UserProfile'
import FriendList from './components/FriendList';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" />} />
            <Route path="/notification" element={user ? <Notification /> : <Navigate to="/login" />} />
            <Route path="/friends" element={user ? <FriendList /> : <Navigate to="/login" />} />

            <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/login" />} />
            <Route path="/user-profile/:userId" element={<UserProfile />} />


            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:postId" element={user ? <PostDetail /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        <Footer />
      </AppContainer>
    </Router>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;