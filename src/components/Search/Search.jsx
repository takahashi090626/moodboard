import React, { useState } from 'react';
import styled from 'styled-components';
import { searchUsers, searchPostsByEmotion } from '../../services/searchService';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #282c3e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 12px;
  font-size: 16px;
  background-color: #353a50;
  color: #fff;
  border: none;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #e74c3c;
  }

  &::placeholder {
    color: #8e8e8e;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8e8e8e;
`;

const EmotionSelector = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const EmotionButton = styled.button`
  font-size: 24px;
  background: ${props => props.selected ? '#353a50' : 'none'};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #353a50;
  }
`;

const SearchButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
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
      <SearchInputContainer>
        <SearchInput
          type="text"
          placeholder="ユーザーIDで検索..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleUserSearch()}
        />
        <SearchIcon />
      </SearchInputContainer>
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