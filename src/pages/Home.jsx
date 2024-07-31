import React from 'react';
import PostForm from '../components/Post/PostForm';
import PostList from '../components/Post/PostList';

function Home() {
  return (
    <div className="home">
     
      <PostForm />
      <PostList />
    </div>
  );
}

export default Home;