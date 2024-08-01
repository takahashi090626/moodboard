import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getUserPosts, sendFriendRequest, checkFriendshipStatus } from '../services/userService';
import PostList from '../components/Post/PostList';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../styles/StyledComponents';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendshipStatus, setFriendshipStatus] = useState('none');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          setLoading(true);
          setError(null);
          const userProfile = await getUserProfile(userId);
          if (!userProfile) {
            setError('User not found');
            return;
          }
          const userPosts = await getUserPosts(userId);
          const status = await checkFriendshipStatus(user.uid, userId);
          setProfile(userProfile);
          setPosts(userPosts);
          setFriendshipStatus(status);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user profile');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [userId, user.uid]);

  const handleUserClick = (clickedUserId) => {
    navigate(`/profile/${clickedUserId}`);
  };

  const handleFriendRequest = async () => {
    try {
      await sendFriendRequest(user.uid, userId);
      setFriendshipStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>{profile.username}'s Profile</h1>
      <img src={profile.avatarURL} alt={profile.username} />
      {user.uid !== userId && (
        <div>
          {friendshipStatus === 'none' && (
            <Button onClick={handleFriendRequest}>Send Friend Request</Button>
          )}
          {friendshipStatus === 'pending' && (
            <Button disabled>Friend Request Pending</Button>
          )}
          {friendshipStatus === 'friends' && (
            <Button disabled>Friends</Button>
          )}
        </div>
      )}
      <PostList posts={posts} onUserClick={handleUserClick} />
    </div>
  );
}

export default UserProfile;