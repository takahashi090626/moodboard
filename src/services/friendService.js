import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const sendFriendRequest = async (senderId, receiverId) => {
  const requestRef = doc(db, 'friendRequests', `${senderId}_${receiverId}`);
  await setDoc(requestRef, {
    sender: senderId,
    receiver: receiverId,
    status: 'pending',
    createdAt: new Date()
  });
};

export const checkFriendStatus = async (userId1, userId2) => {
  const friendDoc = await getDoc(doc(db, 'friends', `${userId1}_${userId2}`));
  if (friendDoc.exists()) {
    return 'friends';
  }

  const requestQuery = query(
    collection(db, 'friendRequests'),
    where('sender', 'in', [userId1, userId2]),
    where('receiver', 'in', [userId1, userId2])
  );
  const requestSnapshot = await getDocs(requestQuery);
  
  if (!requestSnapshot.empty) {
    return 'pending';
  }

  return 'none';
};