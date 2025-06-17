import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [aiPrompt, setAIPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [aiMode, setAIMode] = useState(false);
  const inputRef = useRef(null);
  const aiInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || aiMode) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `http://localhost:5002/items/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        setSuggestions([]);
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, aiMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAIQuery = async (prompt) => {
    setAILoading(true);
    setSuggestions([]);
    try {
      const res = await fetch("http://localhost:5003/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setSuggestions([]);
    }
    setAILoading(false);
    setShowSuggestions(true);
  };

  // Switch to AI mode
  const handleAISwitch = () => {
    setAIMode(true);
    setAIPrompt("");
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => aiInputRef.current && aiInputRef.current.focus(), 100);
  };

  // Switch back to normal mode
  const handleBackToNormal = () => {
    setAIMode(false);
    setAIPrompt("");
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 100);
  };

  return (
    <div
      className="search-container"
      ref={searchContainerRef}
      style={{ display: "flex", alignItems: "center", position: "relative" }}
    >
      {/* ICON ON THE LEFT, SWITCHES BASED ON MODE */}
      {!aiMode ? (
        <img
          src="/images/search-icon.png"
          alt="Search"
          className="search-icon"
        />
      ) : (
        <img
          src="/images/ai-icon-search.png"
          alt="AI Search"
          className="search-icon"
        />
      )}
      <div className="input-wrapper" style={{ flex: 1, position: "relative" }}>
        {!aiMode ? (
          <>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (query.trim()) {
                    navigate(`/filtered?q=${encodeURIComponent(query.trim())}`);
                    setShowSuggestions(false);
                  }
                }
              }}
              ref={inputRef}
              className={`search-input ${query ? "has-text" : ""}`}
              aria-label="Search furb"
            />
            {!query && (
              <div
                className="search-placeholder"
                onClick={() => inputRef.current.focus()}
              >
                Search <span className="search-placeholder-bold">furb.</span>
              </div>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (aiPrompt.trim()) {
                    handleAIQuery(aiPrompt.trim());
                  }
                }
              }}
              ref={aiInputRef}
              className="search-input"
              placeholder="Ask AI to find products for you..."
              aria-label="AI Search"
            />
          </>
        )}
        {/* SWITCH BUTTON ON THE RIGHT */}
        <div
          className="ai-switch-icon"
          onClick={aiMode ? handleBackToNormal : handleAISwitch}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {!aiMode ? (
            <img
              src="/images/ai-icon.png"
              alt="Switch to AI Search"
              style={{ width: 22, height: 22, opacity: 0.7, marginRight:0 }}
            />
          ) : (
            <span style={{ fontWeight: "bold", fontSize: 28, lineHeight: 1 , opacity:0.6}}>×</span>
          )}
        </div>
      </div>
      {showSuggestions &&
        (aiLoading ? (
          <div className="search-suggestions">
            <div style={{ padding: 8 }}>Searching with AI...</div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="search-suggestions">
            {suggestions.map((item) => (
              <div
                key={item._id}
                className="suggestion-item"
                onClick={() => navigate(`/item/${item._id}`)}
              >
                <div className="suggestion-content">
                  <span className="suggestion-price">{item.price}</span>
                  <span className="suggestion-title">{item.title}</span>
                  <span className="suggestion-location">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          (query || aiPrompt) && (
            <div className="search-suggestions">
              <div style={{ padding: 8, color: "#888" }}>No results found.</div>
            </div>
          )
        ))}
    </div>
  );
};

export default SearchBar;