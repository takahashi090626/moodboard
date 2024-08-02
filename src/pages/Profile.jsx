import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProfileContainer, ProfileHeader, Avatar, ProfileContent, Button } from '../styles/StyledComponents';
import UserPostList from '../components/Post/UserPostList';
import styled from 'styled-components';

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LargeAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
`;

function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState([]);

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserId(data.userId || '');
        setAvatarURL(data.avatarURL || '');
        setBio(data.bio || '');
      }
    }
  }, [user]);

  const fetchUserPosts = useCallback(async () => {
    if (user) {
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(postsQuery);
      const userPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [fetchUserProfile, fetchUserPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newAvatarURL = avatarURL;

    if (avatar) {
      const avatarRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(avatarRef, avatar);
      newAvatarURL = await getDownloadURL(avatarRef);
    }

    await setDoc(doc(db, 'users', user.uid), {
      userId,
      avatarURL: newAvatarURL,
      bio
    }, { merge: true });

    await updateUserProfile({ userId, avatarURL: newAvatarURL, bio });
    alert('Profile updated successfully!');
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <h2>My Profile</h2>
        </ProfileHeader>
        <ProfileContent>
          <ProfileForm onSubmit={handleSubmit}>
            <AvatarContainer>
              <LargeAvatar src={avatarURL || '/default-avatar.png'} alt="User avatar" />
              <FormGroup>
                <Label htmlFor="avatar">Change Avatar:</Label>
                <Input
                  type="file"
                  id="avatar"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </FormGroup>
            </AvatarContainer>
            <FormGroup>
              <Label htmlFor="userId">User ID:</Label>
              <Input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bio">Bio:</Label>
              <TextArea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
              />
            </FormGroup>
            <Button type="submit">Update Profile</Button>
          </ProfileForm>
        </ProfileContent>
      </ProfileCard>
      <h3>My Posts</h3>
      <UserPostList posts={posts} />
    </ProfileContainer>
  );
}

export default Profile;