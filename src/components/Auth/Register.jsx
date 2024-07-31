import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { AuthContainer, AuthTitle, AuthForm, AuthInput, AuthButton, AuthLink } from '../../styles/AuthStyles';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        userId,
      });
      navigate('/login');
    } catch (error) {
      setError('登録に失敗しました。もう一度お試しください。');
      console.error('Error registering user:', error);
    }
  };

  return (
    <AuthContainer>
      <AuthTitle>新規登録</AuthTitle>
      <AuthForm onSubmit={handleRegister}>
        <AuthInput
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        <AuthButton type="submit">登録</AuthButton>
      </AuthForm>
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      <AuthLink>
        既にアカウントをお持ちの方は <Link to="/login">こちら</Link> からログイン
      </AuthLink>
    </AuthContainer>
  );
}

export default Register;