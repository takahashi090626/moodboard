import React, { useState } from 'react';
import styled from 'styled-components';
import Search from '../components/Search/Search';
import SearchResults from '../components/Search/SearchResults';

const SearchPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <SearchPageContainer>
      <h1>検索</h1>
      <Search onSearchResults={handleSearchResults} />
      <SearchResults results={searchResults} />
    </SearchPageContainer>
  );
};

export default SearchPage;