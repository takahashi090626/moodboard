import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ProfileContainer, ProfileHeader, Avatar, ProfileContent, Button } from '../styles/StyledComponents';
import PostList from '../components/Post/PostList';

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendStatus, setFriendStatus] = useState('none'); // 'none', 'pending', 'friends'

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            setProfile({ id: userDoc.id, ...userDoc.data() });
          } else {
            console.log('User not found');
            navigate('/404');
          }
          // ここでポストの取得ロジックを実装
          // フレンドステータスの確認ロジックを実装
          await checkFriendStatus();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId, user.uid]);

  const checkFriendStatus = async () => {
    if (user.uid === userId) {
      setFriendStatus('self');
      return;
    }
    const friendRequestDoc = await getDoc(doc(db, 'friendRequests', `${user.uid}_${userId}`));
    if (friendRequestDoc.exists()) {
      setFriendStatus(friendRequestDoc.data().status);
    } else {
      setFriendStatus('none');
    }
  };

  const handleFriendRequest = async () => {
    if (friendStatus === 'none') {
      await setDoc(doc(db, 'friendRequests', `${user.uid}_${userId}`), {
        sender: user.uid,
        receiver: userId,
        status: 'pending',
        timestamp: new Date()
      });
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
      <ProfileHeader>
        <Avatar src={profile.avatarURL || '/default-avatar.png'} alt="User avatar" />
        <h2>{profile.user_id}</h2>
      </ProfileHeader>
      <ProfileContent>
        {friendStatus === 'none' && (
          <Button onClick={handleFriendRequest}>Send Friend Request</Button>
        )}
        {friendStatus === 'pending' && (
          <Button onClick={handleFriendRequest}>Cancel Friend Request</Button>
        )}
        {friendStatus === 'friends' && (
          <Button disabled>Friends</Button>
        )}
        {/* その他のプロフィール情報 */}
      </ProfileContent>
      <PostList posts={posts} onUserClick={(id) => navigate(`/profile/${id}`)} />
    </ProfileContainer>
  );
}

export default UserProfile;