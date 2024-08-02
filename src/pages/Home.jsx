import React from 'react';
import PostForm from '../components/Post/PostForm';
import PostList from '../components/Post/PostList';
import styled from 'styled-components';
import NotificationBox from '../components/NotificationBox';
import { QueryClient, QueryClientProvider } from 'react-query';

const HomeContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const queryClient = new QueryClient();

function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContainer>
        <PostForm />
        <PostList />
      </HomeContainer>
    </QueryClientProvider>
  );
}

export default Home;