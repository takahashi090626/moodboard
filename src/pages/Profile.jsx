import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db, storage } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [userId, setUserId] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState('');

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserId(data.userId || '');
        setAvatarURL(data.avatarURL || '');
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

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
      avatarURL: newAvatarURL
    }, { merge: true });

    await updateUserProfile({ userId, avatarURL: newAvatarURL });
    alert('Profile updated successfully!');
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
          />
        </div>
        {avatarURL && <img src={avatarURL} alt="Current avatar" width="100" />}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;