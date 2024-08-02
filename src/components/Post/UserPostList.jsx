import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  doc,
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
  TimeStamp,
  EmotionIcon,
  Button,
  LikeCount
} from '../../styles/StyledComponents';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styled from 'styled-components';

const UserLink = styled.span`
  color: #1877f2;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

function UserPostList({ posts = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleUserClick = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  if (posts.length === 0) {
    return <p>No posts to display.</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostContainer key={post.id} emotion={post.emotion}>
          <PostHeader>
            <Avatar src={post.userAvatar || '/default-avatar.png'} alt="User avatar" />
            <UserLink onClick={() => handleUserClick(post.userId)}>
              {post.username}
            </UserLink>
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
            <Button onClick={() => handleLike(post.id, post.isLiked)}>
              {post.isLiked ? (
                <FaHeart color="red" size="1.5em" />
              ) : (
                <FaRegHeart color="gray" size="1.5em" />
              )}
            </Button>
            <LikeCount>{post.likeCount} likes</LikeCount>
            <Link to={`/post/${post.id}`}>
              <Button>💬 ({post.commentCount})</Button>
            </Link>
          </PostFooter>
        </PostContainer>
      ))}
    </div>
  );
}

export default UserPostList;