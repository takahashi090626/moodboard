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
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { createNotification } from '../../services/userService';


const UserLink = styled.span`
  color: #1877f2;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  margin: 20px 0;
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
    getNextPageParam: (lastPage) => lastPage.lastVisible || undefined,
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
        // 投稿者が自分でない場合にのみ通知を作成
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
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.posts.map((post) => (
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
                    <Button onClick={() => handleDelete.mutate(post.id)}>Delete</Button>
                  </>
                )}
                <Button onClick={() => handleLike.mutate({ postId: post.id, isLiked: post.isLiked, postUserId: post.userId })}>
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
        </React.Fragment>
      ))}
      {isFetchingNextPage && <LoadingSpinner>Loading more posts...</LoadingSpinner>}
      <div ref={observerTarget} />
    </div>
  );
}

export default PostList;