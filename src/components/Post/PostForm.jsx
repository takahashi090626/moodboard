import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Textarea } from '../../styles/StyledComponents';
import EmotionRippleEffect from '../EmotionRipple';
import { predictEmotion, recommendContent } from '../../services/aiHelper';

function PostForm() {
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');
  const [showRipple, setShowRipple] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const { user } = useAuth();

  const emotions = ['😊', '😢', '😠', '😎', '🤔'];

  useEffect(() => {
    if (content) {
      const predictedEmotion = predictEmotion(content);
      setEmotion(predictedEmotion);
    }
  }, [content]);

  const getUserPosts = async (userId) => {
    const q = query(collection(db, 'posts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        content,
        emotion,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setContent('');
      setEmotion('');
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 1000);

      // Get content recommendation
      const userPosts = await getUserPosts(user.uid);
      const newRecommendation = recommendContent(userPosts);
      setRecommendation(newRecommendation);
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
        />
        <div>
          {emotions.map((emoji) => (
            <Button
              key={emoji}
              type="button"
              onClick={() => setEmotion(emoji)}
              style={{ backgroundColor: emotion === emoji ? '#ddd' : 'transparent' }}
            >
              {emoji}
            </Button>
          ))}
        </div>
        <Button type="submit">Post</Button>
      </form>
      {showRipple && <EmotionRippleEffect emotion={emotion} />}
      {recommendation && <p>{recommendation}</p>}
    </div>
  );
}

export default PostForm;