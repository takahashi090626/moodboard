import React from 'react';
import PostForm from '../components/Post/PostForm';
import PostList from '../components/Post/PostList';

function Home() {
  return (
    <div className="home">
      <h1>Welcome to MoodBoard</h1>
      <PostForm />
      <PostList />
    </div>
  );
}

export default Home;