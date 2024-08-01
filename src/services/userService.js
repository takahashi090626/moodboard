import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const getUserProfile = async (userId) => {
  if (!userId) throw new Error('userId is required');
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  } else {
    console.log(`No user found with id: ${userId}`);
    return null; // ユーザーが見つからない場合はnullを返す
  }
};

export const getUserPosts = async (userId) => {
  if (!userId) throw new Error('userId is required');
  const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(postsQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const sendFriendRequest = async (senderId, receiverId) => {
  if (!senderId || !receiverId) throw new Error('Both senderId and receiverId are required');
  const friendRequestRef = collection(db, 'friendRequests');
  await addDoc(friendRequestRef, {
    senderId,
    receiverId,
    status: 'pending',
    createdAt: new Date()
  });
};

export const checkFriendshipStatus = async (userId1, userId2) => {
  const user1Doc = await getDoc(doc(db, 'users', userId1));
  const user2Doc = await getDoc(doc(db, 'users', userId2));

  if (user1Doc.data().friends && user1Doc.data().friends.includes(userId2)) {
    return 'friends';
  }

  const requestQuery = query(
    collection(db, 'friendRequests'),
    where('senderId', 'in', [userId1, userId2]),
    where('receiverId', 'in', [userId1, userId2]),
    where('status', '==', 'pending')
  );

  const querySnapshot = await getDocs(requestQuery);
  return querySnapshot.empty ? 'none' : 'pending';
};

export const getFriendRequests = async (userId) => {
  const requestsQuery = query(
    collection(db, 'friendRequests'),
    where('receiverId', '==', userId),
    where('status', '==', 'pending')
  );
  const querySnapshot = await getDocs(requestsQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const acceptFriendRequest = async (requestId, userId, friendId) => {
  await updateDoc(doc(db, 'friendRequests', requestId), { status: 'accepted' });
  await updateDoc(doc(db, 'users', userId), { friends: arrayUnion(friendId) });
  await updateDoc(doc(db, 'users', friendId), { friends: arrayUnion(userId) });
};

export const rejectFriendRequest = async (requestId) => {
  await updateDoc(doc(db, 'friendRequests', requestId), { status: 'rejected' });
};