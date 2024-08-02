import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';

export const searchUsers = async (searchTerm) => {
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef, 
    where('userId', '>=', searchTerm),
    where('userId', '<=', searchTerm + '\uf8ff'),
    limit(20)
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    type: 'user',
    ...doc.data()
  }));
};

export const searchPostsByEmotion = async (emotion) => {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef, 
    where('emotion', '==', emotion),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  
  try {
    const querySnapshot = await getDocs(q);
    const posts = [];
    for (const postDoc of querySnapshot.docs) {
      const postData = postDoc.data();
      const userDocRef = doc(db, 'users', postData.userId);
      const userDocSnap = await getDoc(userDocRef);
      posts.push({
        id: postDoc.id,
        type: 'post',
        ...postData,
        user: userDocSnap.exists() ? userDocSnap.data() : null
      });
    }
    return posts;
  } catch (error) {
    console.error("Error searching posts by emotion:", error);
    throw error;
  }
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

export const searchPosts = async (searchTerm) => {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef,
    where('content', '>=', searchTerm),
    where('content', '<=', searchTerm + '\uf8ff'),
    orderBy('content'),
    limit(20)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};