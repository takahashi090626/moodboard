import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaComment } from 'react-icons/fa';

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultItem = styled.div`
  background-color: #353a50;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const PostHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #282c3e;
`;

const PostContent = styled.div`
  padding: 16px;
  color: #fff;
`;

const PostFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #282c3e;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
`;

const UserName = styled.span`
  font-weight: bold;
  color: #fff;
`;

const UserLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
`;

const PostText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #fff;
`;

const EmotionIcon = styled.span`
  font-size: 24px;
  margin-right: 8px;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  color: #8e8e8e;
  font-size: 14px;
`;

const Icon = styled.span`
  margin-right: 4px;
`;

const NoResults = styled.p`
  text-align: center;
  font-style: italic;
  color: #8e8e8e;
  padding: 20px;
  background-color: #353a50;
  border-radius: 8px;
`;

const SearchResults = ({ results }) => {
  if (results.length === 0) {
    return <NoResults>検索結果がありません。</NoResults>;
  }

  return (
    <ResultsContainer>
      {results.map((result) => (
        <ResultItem key={result.id}>
          <PostHeader>
            <UserLink to={`/profile/${result.userId}`}>
              <Avatar src={result.userAvatar || '/default-avatar.png'} alt={result.username} />
              <UserName>{result.username}</UserName>
            </UserLink>
          </PostHeader>
          <PostContent>
            <PostText>{result.content}</PostText>
          </PostContent>
          <PostFooter>
            <EmotionIcon>{result.emotion}</EmotionIcon>
            <PostMeta>
              <Icon><FaHeart /></Icon> {result.likeCount || 0}
              <Icon style={{ marginLeft: '12px' }}><FaComment /></Icon> {result.commentCount || 0}
            </PostMeta>
          </PostFooter>
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};

export default SearchResults;