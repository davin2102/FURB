import React, { useState, useEffect } from 'react';
import './ItemBox.css';

const ItemBox = ({
  title = 'Product Title',
  price = '$99.99',
  image = 'https://via.placeholder.com/150',
  location = 'Jakarta',
}) => {
  const [bookmarked, setBookmarked] = useState(false);

  // Check if this item is bookmarked on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookmarkedItems') || '[]');
    setBookmarked(stored.some(item => item.title === title && item.image === image));
  }, [title, image]);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const stored = JSON.parse(localStorage.getItem('bookmarkedItems') || '[]');
    let updated;
    if (bookmarked) {
      updated = stored.filter(item => !(item.title === title && item.image === image));
    } else {
      updated = [...stored, { title, price, image, location }];
    }
    localStorage.setItem('bookmarkedItems', JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  return (
    <div className="ItemBox">
      <button
        className={`bookmark-icon${bookmarked ? ' bookmarked' : ''}`}
        onClick={handleBookmark}
        aria-label="Bookmark"
      >
        {bookmarked ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#f4b400"
            stroke="#f4b400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bbb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
      <h2>{title}</h2>
      <img src={image} alt={title} className="product-image" />
      <div className="price">{price}</div>
      <div className="location">Location: {location}</div>
      <button className="add-to-cart">Purchase Now</button>
    </div>
  );
};

export default ItemBox;