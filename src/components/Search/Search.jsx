import React, { useState } from 'react';
import styled from 'styled-components';
import { searchUsers, searchPostsByEmotion } from '../../services/searchService';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const EmotionSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const EmotionButton = styled.button`
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: ${props => props.selected ? 1 : 0.5};
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #166fe5;
  }
`;

const emotions = ['😊', '😠', '😲', '😨', '❤️', '🤔'];

const Search = ({ onSearchResults }) => {
  const [userQuery, setUserQuery] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleUserSearch = async () => {
    if (userQuery.trim()) {
      const results = await searchUsers(userQuery);
      onSearchResults(results);
    }
  };

  const handleEmotionSearch = async () => {
    if (selectedEmotion) {
      const results = await searchPostsByEmotion(selectedEmotion);
      onSearchResults(results);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="ユーザーIDで検索..."
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
      />
      <SearchButton onClick={handleUserSearch}>ユーザー検索</SearchButton>

      <EmotionSelector>
        {emotions.map((emotion) => (
          <EmotionButton
            key={emotion}
            onClick={() => setSelectedEmotion(emotion === selectedEmotion ? null : emotion)}
            selected={emotion === selectedEmotion}
          >
            {emotion}
          </EmotionButton>
        ))}
      </EmotionSelector>
      <SearchButton onClick={handleEmotionSearch}>感情で検索</SearchButton>
    </SearchContainer>
  );
};

export default Search;