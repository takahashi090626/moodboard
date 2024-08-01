import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ProfileContainer, ProfileHeader, Avatar, ProfileContent } from '../styles/StyledComponents';

function Profile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchProfileData();
  }, [userId]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar src={profileData.avatarURL || '/default-avatar.png'} alt="User avatar" />
        <h2>{profileData.userId}</h2>
      </ProfileHeader>
      <ProfileContent>
        <p>Email: {profileData.email}</p>
        {/* 他のプロフィール情報をここに追加 */}
      </ProfileContent>
    </ProfileContainer>
  );
}

export default Profile;
