import React, { useState, useRef, useEffect } from 'react';
import searchIcon from '/images/search-icon.png';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className="search-container">
      <img
        src={searchIcon}
        alt="Search"
        className="search-icon"
      />

      <div className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputRef}
          className={`search-input ${query ? 'has-text' : ''}`}
          aria-label="Search furb"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {!query && (
          <div 
            className="search-placeholder"
            onClick={() => inputRef.current.focus()}
          >
            Search <span className="search-placeholder-bold">furb.</span>
          </div>
        )}

        {isFocused && (
          <span className="blinking-caret"></span>
        )}
      </div>
    </div>
  );
};

export default SearchBar;