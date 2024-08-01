import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../styles/StyledComponents';

function FriendList() {
  const [friends, setFriends] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('friends', 'array-contains', user.uid));
      const querySnapshot = await getDocs(q);
      const friendsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFriends(friendsList);
    };

    if (user) {
      fetchFriends();
    }
  }, [user]);

  const handleFriendClick = (friendId) => {
    navigate(`/user-profile/${friendId}`);
  };

  return (
    <div>
      <h2>フレンド一覧</h2>
      {friends.length === 0 ? (
        <p>フレンドがいません。</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>
              <Button onClick={() => handleFriendClick(friend.id)}>{friend.userId}</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FriendList;