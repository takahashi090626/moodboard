import React, { useState } from 'react';
import styled from 'styled-components';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../styles/StyledComponents';

const PostFormWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PostInput = styled.textarea`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1.1em;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #e94560;
  }
`;

const MoodSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const MoodIcon = styled.span`
  font-size: 2em;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.selected ? 1 : 0.5};
  transform: ${props => props.selected ? 'scale(1.2)' : 'scale(1)'};
  
  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const PostButton = styled(Button)`
  float: right;
`;

function PostForm() {
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');
  const { user } = useAuth();

  const emotions = [
    { emoji: '😊', name: '幸福' },
    { emoji: '😠', name: '怒り' },
    { emoji: '😲', name: '驚き' },
    { emoji: '😨', name: '恐怖' },
    { emoji: '❤️', name: '愛' },
    { emoji: '🤔', name: '考える' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !emotion) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        emotion,
        userId: user.uid,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0
      });
      setContent('');
      setEmotion('');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  return (
    <PostFormWrapper>
      <form onSubmit={handleSubmit}>
        <PostInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今の気分は？"
        />
        <MoodSelector>
          {emotions.map(({ emoji, name }) => (
            <MoodIcon
              key={emoji}
              onClick={() => setEmotion(emoji)}
              selected={emotion === emoji}
              title={name}
            >
              {emoji}
            </MoodIcon>
          ))}
        </MoodSelector>
        <PostButton type="submit">投稿</PostButton>
      </form>
    </PostFormWrapper>
  );
}

export default PostForm;