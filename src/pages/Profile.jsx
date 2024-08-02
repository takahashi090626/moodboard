import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ProfileContainer, Button } from '../styles/StyledComponents';
import UserPostList from '../components/Post/UserPostList';
import styled, { keyframes } from 'styled-components';
import { FaCamera, FaEdit } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;


const ProfileCard = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  animation: ${fadeIn} 0.5s ease-in;
  color: #000000; // 文字色を黒に設定
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarLabel = styled.label`
  cursor: pointer;
  color: white;
  font-size: 24px;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #000000; // 文字色を黒に設定
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  color: #000000; // 文字色を黒に設定

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;


const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  color: #000000; // 文字色を黒に設定

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const UpdateButton = styled(Button)`
  align-self: flex-start;
  padding: 12px 24px;
  background-color: #4a90e2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ae8;
  }
`;



const ProfileInfo = styled.div`
  margin-top: 20px;
  color: #000000; // 文字色を黒に設定
`;

const InfoItem = styled.div`
  margin-bottom: 15px;
`;


const InfoLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
  color: #000000; // 文字色を黒に設定
`;


 const EditButton = styled(Button)`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357ae8;
  }
`;

function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState('');
  const [bio, setBio] = useState('');
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <AvatarContainer>
            <AvatarImage src={avatarURL || '/default-avatar.png'} alt="User avatar" />
            {isEditing && (
              <AvatarOverlay>
                <AvatarInput
                  type="file"
                  id="avatar"
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                <AvatarLabel htmlFor="avatar">
                  <FaCamera />
                </AvatarLabel>
              </AvatarOverlay>
            )}
          </AvatarContainer>
        </ProfileHeader>
        {isEditing ? (
          <ProfileForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="userId">User ID</Label>
              <Input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <TextArea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="4"
              />
            </FormGroup>
            <UpdateButton type="submit">変更する</UpdateButton>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </ProfileForm>
        ) : (
          <ProfileInfo>
            <InfoItem>
              <InfoLabel>User ID:</InfoLabel>
              {userId}
            </InfoItem>
            <InfoItem>
              <InfoLabel>自己紹介:</InfoLabel>
              {bio}
            </InfoItem>
            <EditButton onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </EditButton>
          </ProfileInfo>
        )}
      </ProfileCard>
      <h3>My Posts</h3>
      <UserPostList posts={posts} />
    </ProfileContainer>
  );
}

export default Profile;