import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ResultsContainer = styled.div`
  margin-top: 20px;
`;

const ResultItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-weight: bold;
`;

const PostContent = styled.p`
  margin: 5px 0;
`;

const NoResults = styled.p`
  text-align: center;
  font-style: italic;
  color: #666;
`;

const SearchResults = ({ results }) => {
  if (results.length === 0) {
    return <NoResults>検索結果がありません。</NoResults>;
  }

  return (
    <ResultsContainer>
      {results.map((result) => (
        <ResultItem key={result.id}>
          {result.type === 'user' ? (
            <Link to={`/profile/${result.id}`}>
              <Avatar src={result.avatarUrl} alt={result.username} />
              <UserName>{result.username}</UserName>
            </Link>
          ) : (
            <>
                <Avatar src={result.userAvatar || '/default-avatar.png'} alt="User avatar" />              <div>
                <UserName>{result.user.username}</UserName>
                <PostContent>{result.content}</PostContent>
                <span>{result.emotion}</span>
              </div>
            </>
          )}
        </ResultItem>
      ))}
    </ResultsContainer>
  );
};

export default SearchResults;