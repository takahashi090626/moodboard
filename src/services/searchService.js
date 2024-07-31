import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';

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