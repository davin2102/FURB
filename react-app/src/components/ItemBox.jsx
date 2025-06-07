import './ItemBox.css';
import { useState } from 'react';

const ItemBox = ({
  title = 'Product Title',
  price = '$99.99',
  image = 'https://via.placeholder.com/150',
  location = 'Jakarta',
}) => {
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  return (
    <div className="ItemBox">
      <h2>{title}</h2>
      <img src={image} alt={title} className="product-image" />
      <div className="price">{price}</div>
      <div className="location">Location: {location}</div>
      <button className="add-to-cart">Purchase Now</button>
      <button
        className={`bookmark-btn${bookmarked ? ' bookmarked' : ''}`}
        onClick={handleBookmark}
      >
        {bookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>
    </div>
  );
};

export default ItemBox;