import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getUserPosts } from '../services/userService';
import PostList from '../components/Post/PostList';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userProfile = await getUserProfile(userId);
          const userPosts = await getUserPosts(userId);
          setProfile(userProfile);
          setPosts(userPosts);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // エラー処理（例: 404ページへのリダイレクト）
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUserClick = (clickedUserId) => {
    navigate(`/profile/${clickedUserId}`);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <img src={profile.avatarURL} alt={profile.username} />
      <PostList posts={posts} onUserClick={handleUserClick} />
    </div>
  );
}

export default UserProfile;