import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ProfileContainer, ProfileHeader, Avatar, ProfileContent, Button } from '../styles/StyledComponents';
import PostList from '../components/Post/PostList';

function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friendStatus, setFriendStatus] = useState('none');

  const fetchUserPosts = useCallback(async () => {
    const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(postsQuery);
    const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(userPosts);
  }, [userId]);

  const checkFriendStatus = useCallback(async () => {
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
            // ここでエラー処理やリダイレクトを行うことができます
          }
          
          await fetchUserPosts();
          await checkFriendStatus();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [userId, fetchUserPosts, checkFriendStatus]);

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
      <ProfileHeader>
        <Avatar src={profile.avatarURL || '/default-avatar.png'} alt="User avatar" />
        <h2>{profile.userId}</h2>
      </ProfileHeader>
      <ProfileContent>
        {user.uid !== userId && (
          <>
            {friendStatus === 'none' && (
              <Button onClick={handleFriendRequest}>Send Friend Request</Button>
            )}
            {friendStatus === 'pending' && (
              <Button onClick={handleFriendRequest}>Cancel Friend Request</Button>
            )}
            {friendStatus === 'friends' && (
              <Button disabled>Friends</Button>
            )}
          </>
        )}
        {/* その他のプロフィール情報をここに追加 */}
      </ProfileContent>
      <h3>User Posts</h3>
      <PostList posts={posts} />
    </ProfileContainer>
  );
}

export default UserProfile;