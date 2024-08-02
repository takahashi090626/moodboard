import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import UserPostList from '../components/Post/UserPostList';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  animation: ${fadeIn} 0.5s ease-in;
  color: #000000;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const ProfileInfo = styled.div`
  flex-grow: 1;
`;

const Username = styled.h2`
  margin: 0;
  color: #000000;
`;

const ProfileContent = styled.div`
  margin-top: 20px;
`;

const StyledButton = styled.button`
  background-color: #4a90e2;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ae8;
  }
`;

const FriendStatus = styled.p`
  color: #4caf50;
  font-weight: bold;
  margin-top: 10px;
`;

function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendStatus, setFriendStatus] = useState('none');

  const checkFriendStatus = useCallback(async () => {
    if (user.uid === userId) {
      setFriendStatus('self');
      return;
    }
    
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists() && userDoc.data().friends && userDoc.data().friends.includes(userId)) {
      setFriendStatus('friends');
      return;
    }

    const friendRequestDoc = await getDoc(doc(db, 'friendRequests', `${user.uid}_${userId}`));
    if (friendRequestDoc.exists()) {
      setFriendStatus(friendRequestDoc.data().status);
    } else {
      setFriendStatus('none');
    }
  }, [user.uid, userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            setProfile({ id: userDoc.id, ...userDoc.data() });
          } else {
            console.log('User not found');
          }
          
          const fetchUserPosts = async () => {
            const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
            const querySnapshot = await getDocs(postsQuery);
            const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(userPosts);
          };

          await fetchUserPosts();
          await checkFriendStatus();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId, checkFriendStatus]);

  const handleFriendRequest = async () => {
    if (friendStatus === 'none') {
      const requestData = {
        sender: user.uid,
        receiver: userId,
        status: 'pending',
        timestamp: new Date()
      };
      await setDoc(doc(db, 'friendRequests', `${user.uid}_${userId}`), requestData);
      setFriendStatus('pending');
    } else if (friendStatus === 'pending') {
      await deleteDoc(doc(db, 'friendRequests', `${user.uid}_${userId}`));
      setFriendStatus('none');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <Avatar src={profile.avatarURL || '/default-avatar.png'} alt="User avatar" />
          <ProfileInfo>
            <Username>{profile.userId}</Username>
            {profile.bio && <p>{profile.bio}</p>}
          </ProfileInfo>
        </ProfileHeader>
        <ProfileContent>
          {user.uid !== userId && (
            <>
              {friendStatus === 'none' && (
                <StyledButton onClick={handleFriendRequest}>Send Friend Request</StyledButton>
              )}
              {friendStatus === 'pending' && (
                <StyledButton onClick={handleFriendRequest}>Cancel Friend Request</StyledButton>
              )}
              {friendStatus === 'friends' && (
                <FriendStatus>We are friends!!</FriendStatus>
              )}
            </>
          )}
        </ProfileContent>
      </ProfileCard>
      <h3>{profile.userId}'s Posts</h3>
      <UserPostList posts={posts} />
    </ProfileContainer>
  );
}

export default UserProfile;