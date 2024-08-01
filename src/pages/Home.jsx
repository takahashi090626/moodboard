import React from 'react';
import PostForm from '../components/Post/PostForm';
import PostList from '../components/Post/PostList';
import styled from 'styled-components';
import NotificationBox from '../components/NotificationBox';

const HomeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

function Home() {
  return (
    <div className="home">
           <NotificationBox />

      <PostForm />
      <PostList />
    </div>
  );
}

export default Home;    