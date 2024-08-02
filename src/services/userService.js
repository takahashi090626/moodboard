import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, arrayUnion, deleteDoc, orderBy, limit } from 'firebase/firestore';

export const getUserProfile = async (userId) => {
  if (!userId) throw new Error('userId is required');
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  } else {
    console.log(`No user found with id: ${userId}`);
    return null;
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

  if (user1Doc.data().friends && user1Doc.data().friends.includes(userId2)) {
    return 'friends';
  }

  const requestQuery = query(
    collection(db, 'friendRequests'),
    where('sender', 'in', [userId1, userId2]),
    where('receiver', 'in', [userId1, userId2]),
    where('status', '==', 'pending')
  );

  const querySnapshot = await getDocs(requestQuery);
  return querySnapshot.empty ? 'none' : 'pending';
};

export const getFriendRequests = async (userId) => {
  const requestsQuery = query(
    collection(db, 'friendRequests'),
    where('receiver', '==', userId),
    where('status', '==', 'pending')
  );
  const querySnapshot = await getDocs(requestsQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const acceptFriendRequest = async (requestId, userId, friendId) => {
  const requestRef = doc(db, 'friendRequests', requestId);
  const userRef = doc(db, 'users', userId);
  const friendRef = doc(db, 'users', friendId);

  await updateDoc(requestRef, { status: 'accepted' });
  await updateDoc(userRef, { friends: arrayUnion(friendId) });
  await updateDoc(friendRef, { friends: arrayUnion(userId) });
};

export const rejectFriendRequest = async (requestId) => {
  await deleteDoc(doc(db, 'friendRequests', requestId));
};

export const getNotifications = async (userId) => {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('receiverId', '==', userId),
    where('isRead', '==', false),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markNotificationAsRead = async (notificationId) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { isRead: true });
  return { id: notificationId, isRead: true };
};
export const createNotification = async (type, senderId, receiverId, postId = null, content = null) => {
  const notificationRef = collection(db, 'notifications');
  await addDoc(notificationRef, {
    type,
    senderId,
    receiverId,
    postId,
    content,
    isRead: false,
    createdAt: new Date()
  });
};