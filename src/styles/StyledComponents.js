import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { animated } from '@react-spring/web';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f0f2f5;
    margin: 0;
    padding: 0;
  }
`;

export const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const Header = styled.header`
  background-color: #ffffff;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

export const PostContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const PostContent = styled.p`
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 10px;
`;

export const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #65676b;
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

export const EmotionRipple = styled(animated.div)`
  position: absolute;
  border-radius: 50%;
  background-color: ${props => props.color};
  animation: ${ripple} 1s ease-out;
`;

export const Button = styled.button`
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    background-color: #166fe5;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-size: 16px;
  min-height: 100px;
`;

export const UserName = styled.span`
  font-weight: 600;
  margin-left: 10px;
`;

export const TimeStamp = styled.span`
  color: #65676b;
  font-size: 12px;
`;

export const EmotionIcon = styled.span`
  font-size: 20px;
  margin-right: 5px;
`;

export const LikeCount = styled.span`
  font-size: 14px;
  color: #65676b;
  margin-left: 5px;
`;

export const CommentContainer = styled.div`
  background-color: #f0f2f5;
  border-radius: 8px;
  padding: 10px;
  margin-top: 10px;
`;