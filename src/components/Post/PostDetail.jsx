import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PostContainer, 
  PostHeader, 
  PostContent, 
  PostFooter, 
  Avatar, 
  UserName, 
  TimeStamp, 
  EmotionIcon, 
  Button, 
  Input,
  CommentContainer
} from '../../styles/StyledComponents';

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const postDocRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postDocRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const userDocRef = doc(db, 'users', postData.userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        setPost({
          id: postDoc.id,
          ...postData,
          userAvatar: userData?.avatarURL || '',
          userId: userData?.userId || 'Anonymous',
          createdAt: postData.createdAt?.toDate().toLocaleString() || ''
        });
      }
    };

    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const commentsData = [];
      for (const commentDoc of querySnapshot.docs) {
        const commentData = commentDoc.data();
        const userDocRef = doc(db, 'users', commentData.userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.data();
        commentsData.push({
          id: commentDoc.id,
          ...commentData,
          userAvatar: userData?.avatarURL || '',
          userId: userData?.userId || 'Anonymous',
          createdAt: commentData.createdAt?.toDate().toLocaleString() || ''
        });
      }
      setComments(commentsData);
    });

    fetchPost();
    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const commentsCollectionRef = collection(db, 'posts', postId, 'comments');
      await addDoc(commentsCollectionRef, {
        content: newComment,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewComment('');
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <PostContainer>
        <PostHeader>
          <Avatar src={post.userAvatar || '/default-avatar.png'} alt="User avatar" />
          <UserName>{post.userId}</UserName>
          <TimeStamp>{post.createdAt}</TimeStamp>
        </PostHeader>
        <PostContent>{post.content}</PostContent>
        <PostFooter>
          <EmotionIcon>{post.emotion}</EmotionIcon>
        </PostFooter>
      </PostContainer>
      <div>
        <Input 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          placeholder="Add a comment..." 
        />
        <Button onClick={handleAddComment}>Post Comment</Button>
      </div>
      {comments.map((comment) => (
        <CommentContainer key={comment.id}>
          <Avatar src={comment.userAvatar || '/default-avatar.png'} alt="User avatar" />
          <UserName>{comment.userId}</UserName>
          <TimeStamp>{comment.createdAt}</TimeStamp>
          <p>{comment.content}</p>
        </CommentContainer>
      ))}
    </div>
  );
}

export default PostDetail;