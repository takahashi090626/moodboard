import React, { useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  increment,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import styled from 'styled-components';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { createNotification } from '../../services/userService';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash } from 'react-icons/fa';

const PostContainer = styled.div`
  background-color: #2d3748;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserLink = styled.span`
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const TimeStamp = styled.span`
  color: #a0aec0;
  font-size: 12px;
`;

const PostContent = styled.p`
  color: #fff;
  margin-bottom: 12px;
`;

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EmotionIcon = styled.span`
  font-size: 24px;
  margin-right: 8px;
`;



const ActionIcon = styled.span`
  margin-right: 4px;
`;

const ActionCount = styled.span`
  margin-left: 4px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #fff;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  &:hover {
    color: #fff;
  }
`;

function PostList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const observerTarget = useRef(null);

  const fetchPosts = async ({ pageParam = null }) => {
    const postsPerPage = 10;
    let postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(postsPerPage)
    );

    if (pageParam) {
      postsQuery = query(postsQuery, startAfter(pageParam));
    }

    const querySnapshot = await getDocs(postsQuery);
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
      post.username = userData?.userId || 'Anonymous';
      post.isLiked = likeDocs[index].exists();
      post.likeCount = post.likeCount || 0;
      post.commentCount = commentDocs[index].size;
    });

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { posts: postsData, lastVisible };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery('posts', fetchPosts, {
    getNextPageParam: (lastPage) => lastPage?.lastVisible || undefined,
  });

  const handleDelete = useMutation(
    async (postId) => {
      if (window.confirm('Are you sure you want to delete this post?')) {
        await deleteDoc(doc(db, 'posts', postId));
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
      },
    }
  );

  const handleLike = useMutation(
    async ({ postId, isLiked, postUserId }) => {
      const likeRef = doc(db, 'posts', postId, 'likes', user.uid);
      const postRef = doc(db, 'posts', postId);

      if (isLiked) {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likeCount: increment(-1) });
      } else {
        await setDoc(likeRef, { userId: user.uid });
        await updateDoc(postRef, { likeCount: increment(1) });
        if (postUserId !== user.uid) {
          await createNotification('like', user.uid, postUserId, postId);
        }
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('posts');
      },
    }
  );

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

  const handleObserver = useCallback((entries) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    const currentObserverTarget = observerTarget.current;
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (currentObserverTarget) observer.observe(currentObserverTarget);
    return () => {
      if (currentObserverTarget) observer.unobserve(currentObserverTarget);
    };
  }, [handleObserver]);

  if (isLoading) {
    return <LoadingSpinner>Loading posts...</LoadingSpinner>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.posts.map((post) => (
            <PostContainer key={post.id}>
              <PostHeader>
                <Avatar src={post.userAvatar || '/default-avatar.png'} alt="User avatar" />
                <UserInfo>
                  <UserLink onClick={() => handleUserClick(post.userId)}>
                    {post.username}
                  </UserLink>
                  <TimeStamp>{formatDate(post.createdAt)}</TimeStamp>
                </UserInfo>
              </PostHeader>
              <PostContent>{post.content}</PostContent>
              <PostFooter>
                <ActionsContainer>
                  <EmotionIcon>{post.emotion}</EmotionIcon>
                  <ActionButton onClick={() => handleLike.mutate({ postId: post.id, isLiked: post.isLiked, postUserId: post.userId })}>
                    {post.isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
                    <ActionCount>{post.likeCount}</ActionCount>
                  </ActionButton>
                  <ActionButton as={Link} to={`/post/${post.id}`}>
                    <FaComment />
                    <ActionCount>{post.commentCount}</ActionCount>
                  </ActionButton>
                </ActionsContainer>
                {user.uid === post.userId && (
                  <ActionsContainer>
                    <ActionButton as={Link} to={`/post/edit/${post.id}`}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete.mutate(post.id)}>
                      <FaTrash />
                    </ActionButton>
                  </ActionsContainer>
                )}
              </PostFooter>
            </PostContainer>
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && <LoadingSpinner>Loading more posts...</LoadingSpinner>}
      <div ref={observerTarget} />
    </div>
  );
}

export default PostList;