import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import styled from 'styled-components';
const FormWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;


const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        // Find user by userId
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.error('User not found');
          return;
        }
  
        const userDoc = querySnapshot.docs[0];
        const userEmail = userDoc.data().email;
  
        // Sign in with email and password
        await signInWithEmailAndPassword(auth, userEmail, password);
        navigate('/');
      } catch (error) {
        console.error('Error logging in:', error);
      }
    };

  return (
    <FormWrapper>
      <form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="ユーザーID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">ログイン</Button>
      </form>
    </FormWrapper>
  );
};

export default Login;