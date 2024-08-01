import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const getUserProfile = async (userId) => {
  if (!userId) throw new Error('userId is required');
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const getUserPosts = async (userId) => {
  if (!userId) throw new Error('userId is required');
  const postsQuery = query(collection(db, 'posts'), where('userId', '==', userId));
  const querySnapshot = await getDocs(postsQuery);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};