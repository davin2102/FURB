import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await fetch(`http://localhost:5002/items/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (err) {
          console.error('Error fetching suggestions:', err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <img src="/images/search-icon.png" alt="Search" className="search-icon" />

      <div className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          ref={inputRef}
          className={`search-input ${query ? 'has-text' : ''}`}
          aria-label="Search furb"
        />

        {!query && (
          <div className="search-placeholder" onClick={() => inputRef.current.focus()}>
            Search <span className="search-placeholder-bold">furb.</span>
          </div>
        )}

        {isFocused && <span className="blinking-caret"></span>}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((item) => (
            <div
              key={item._id}
              className="suggestion-item"
              onClick={() => navigate(`/item/${item._id}`)}
            >
              <div className="suggestion-content">
                <span className="suggestion-price">${item.price}</span>
                <span className="suggestion-title">{item.title}</span>
                <span className="suggestion-location">{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
