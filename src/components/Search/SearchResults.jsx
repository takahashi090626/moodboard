import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultItem = styled.div`
  background-color: ${props => props.emotion === '😊' ? '#4a5568' :
                               props.emotion === '😠' ? '#742a2a' :
                               props.emotion === '😲' ? '#2a4365' :
                               props.emotion === '😨' ? '#22543d' :
                               props.emotion === '❤️' ? '#702459' :
                               props.emotion === '🤔' ? '#744210' : '#2d3748'};
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  padding: 16px;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: bold;
  color: #fff;
  font-size: 16px;
`;

const PostTime = styled.span`
  color: #a0aec0;
  font-size: 14px;
`;

const PostContent = styled.p`
  color: #fff;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EmotionIcon = styled.span`
  font-size: 24px;
  margin-right: 8px;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  color: #a0aec0;
  font-size: 14px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #a0aec0;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  margin-left: 8px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const NoResults = styled.p`
  text-align: center;
  font-style: italic;
  color: #a0aec0;
  padding: 20px;
  background-color: #2d3748;
  border-radius: 8px;
`;

const SearchResults = ({ results }) => {
  if (results.length === 0) {
    return <NoResults>検索結果がありません。</NoResults>;
  }

  return (
    <ResultsContainer>
      {results.map((result) => (
        <ResultItem key={result.id} emotion={result.emotion}>
          <PostHeader>
            <Avatar src={result.userAvatar || '/default-avatar.png'} alt={result.username} />
            <UserInfo>
              <UserName>{result.username}</UserName>
              <PostTime>{new Date(result.createdAt).toLocaleString()}</PostTime>
            </UserInfo>
          </PostHeader>
          <PostContent>{result.content}</PostContent>
          <PostFooter>
            <EmotionIcon>{result.emotion}</EmotionIcon>
            <PostMeta>
              <Icon><FaHeart /></Icon> {result.likeCount || 0}
              <Icon style={{ marginLeft: '12px' }}><FaComment /></Icon> {result.commentCount || 0}
              <ActionButton><FaHeart color={result.isLiked ? 'red' : '#a0aec0'} /></ActionButton>
              <ActionButton><FaComment /></ActionButton>
            </PostMeta>
          </PostFooter>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};

export default SearchResults;