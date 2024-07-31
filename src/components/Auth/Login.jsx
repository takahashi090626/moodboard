import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { AuthContainer, AuthTitle, AuthForm, AuthInput, AuthButton, AuthLink } from '../../styles/AuthStyles';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('ユーザーが見つかりません');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;

      await signInWithEmailAndPassword(auth, userEmail, password);
      console.log('Login successful, navigating to home');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('ログインに失敗しました。ユーザーIDとパスワードを確認してください。');
    }
  };

  return (
    <AuthContainer>
      <AuthTitle>ログイン</AuthTitle>
      <AuthForm onSubmit={handleLogin}>
        <AuthInput
          type="text"
          placeholder="ユーザーID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthButton type="submit">ログイン</AuthButton>
      </AuthForm>
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      <AuthLink>
        アカウントをお持ちでない方は <Link to="/register">こちら</Link> から登録
      </AuthLink>
    </AuthContainer>
  );
}

export default Login;