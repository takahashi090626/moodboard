import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  updateDoc,
  increment,
  Timestamp
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
  LikeCount
} from '../../styles/StyledComponents';

function PostList() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const postsData = [];
      const userPromises = [];
      const likePromises = [];
      const commentPromises = [];

      querySnapshot.forEach((postDoc) => {
        const postData = { id: postDoc.id, ...postDoc.data() };
        postsData.push(postData);
        userPromises.push(getDoc(doc(db, 'users', postData.userId)));
        likePromises.push(getDoc(doc(db, 'posts', postDoc.id, 'likes', user.uid)));
        commentPromises.push(getDocs(collection(db, 'posts', postDoc.id, 'comments')));
      });

      const [userDocs, likeDocs, commentDocs] = await Promise.all([
        Promise.all(userPromises),
        Promise.all(likePromises),
        Promise.all(commentPromises)
      ]);

      postsData.forEach((post, index) => {
        const userData = userDocs[index].data();
        post.userAvatar = userData?.avatarURL || '';
        post.userId = userData?.userId || 'Anonymous';
        post.isLiked = likeDocs[index].exists();
        post.likeCount = post.likeCount || 0;
        post.commentCount = commentDocs[index].size;
      });

      setPosts(postsData);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', postId));
    }
  };

  const handleLike = async (postId, isLiked) => {
    const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
    const postRef = doc(db, 'posts', postId);

    if (isLiked) {
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likeCount: increment(-1) });
    } else {
      await setDoc(likeRef, { userId: user.uid });
      await updateDoc(postRef, { likeCount: increment(1) });
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    } else if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else if (timestamp) {
      return new Date(timestamp).toLocaleString();
    }
    return 'Unknown date';
  };

  return (
    <div>
      {posts.map((post) => (
        <PostContainer key={post.id} emotion={post.emotion}>
          <PostHeader>
            <Avatar src={post.userAvatar || '/default-avatar.png'} alt="User avatar" />
            <UserName>{post.userId}</UserName>
            <TimeStamp>{formatDate(post.createdAt)}</TimeStamp>
          </PostHeader>
          <PostContent>{post.content}</PostContent>
          <PostFooter>
            <EmotionIcon>{post.emotion}</EmotionIcon>
            {user.uid === post.userId && (
              <>
                <Link to={`/post/edit/${post.id}`}>
                  <Button>Edit</Button>
                </Link>
                <Button onClick={() => handleDelete(post.id)}>Delete</Button>
              </>
            )}
            <Button onClick={() => handleLike(post.id, post.isLiked, post.likeCount)}>
              {post.isLiked ? 'Unlike' : 'Like'}
            </Button>
            <LikeCount>{post.likeCount} likes</LikeCount>
            <Link to={`/post/${post.id}`}>
              <Button>Comments ({post.commentCount})</Button>
            </Link>
          </PostFooter>
        </PostContainer>
      ))}
    </div>
  );
}


export default PostList;
