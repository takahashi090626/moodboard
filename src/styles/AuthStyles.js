import styled from 'styled-components';

export const AuthContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

export const AuthTitle = styled.h2`
  text-align: center;
  color: #e94560;
  margin-bottom: 30px;
  font-size: 2em;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const AuthInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1em;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #e94560;
  }
`;

export const AuthButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #e94560;
  color: white;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d63447;
    transform: translateY(-2px);
  }
`;

export const AuthLink = styled.p`
  text-align: center;
  margin-top: 20px;

  a {
    color: #e94560;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;