import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    background-color: #1a1a2e;
    color: #fff;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .mood-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(45deg, #16213e, #0f3460, #533483);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    opacity: 0.7;
    z-index: -1;
  }

  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const PostContainer = styled.div`
  background-color: ${props => {
    switch (props.emotion) {
      case '😊': return 'rgba(255, 193, 7, 0.3)';  // 幸福: 黄色
      case '😠': return 'rgba(244, 67, 54, 0.3)';  // 怒り: 赤
      case '😲': return 'rgba(33, 150, 243, 0.3)'; // 驚き: 青
      case '😨': return 'rgba(156, 39, 176, 0.3)'; // 恐怖: 紫
      case '❤️': return 'rgba(233, 30, 99, 0.3)';  // 愛: ピンク
      case '🤔': return 'rgba(76, 175, 80, 0.3)';  // 考える: 緑
      default: return 'rgba(255, 255, 255, 0.1)';  // デフォルト: 白
    }
  }};
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
`;

export const UserName = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  margin-right: 10px;
`;

export const TimeStamp = styled.span`
  color: #bbb;
  font-size: 0.9em;
`;

export const PostContent = styled.p`
  font-size: 1.1em;
  line-height: 1.5;
  margin-bottom: 15px;
`;

export const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EmotionIcon = styled.span`
  font-size: 1.5em;
  margin-right: 10px;
`;

export const Button = styled.button`
  background-color: #fff;
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d63447;
    transform: translateY(-2px);
  }
`;

export const LikeCount = styled.span`
  margin-left: 5px;
  font-size: 0.9em;
  color: #bbb;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #444;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #e94560;
  }
`;

export const CommentContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-top: 15px;
`;
// src/styles/StyledComponents.js に以下を追加
export const ProfileContainer = styled.div`
  /* スタイルを定義 */
`;

export const ProfileHeader = styled.div`
  /* スタイルを定義 */
`;

export const ProfileContent = styled.div`
  /* スタイルを定義 */
`;

// Add other styled components as needed