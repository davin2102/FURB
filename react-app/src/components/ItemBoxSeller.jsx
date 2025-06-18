import React, { useState, useEffect } from "react";
import "./ItemBox.css";
import { useNavigate } from "react-router-dom";

const ItemBox = ({
  id,
  title = "Product Title",
  price = "$99.99",
  image = "https://via.placeholder.com/150",
  location = "Jakarta",
  seller = "",
  onMarkAsSold,
  isSold = false, // <-- add this line
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isOwnItem, setIsOwnItem] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookmarkedItems") || "[]");
    setBookmarked(
      stored.some((item) => item.title === title && item.image === image)
    );
    const user = JSON.parse(localStorage.getItem("user"));
    setIsOwnItem(user && user.email && seller && user.email === seller);
  }, [title, image, seller]);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const stored = JSON.parse(localStorage.getItem("bookmarkedItems") || "[]");
    let updated;
    if (bookmarked) {
      updated = stored.filter(
        (item) => !(item.title === title && item.image === image)
      );
    } else {
      updated = [...stored, { title, price, image, location }];
    }
    localStorage.setItem("bookmarkedItems", JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  const handleBoxClick = () => {
    navigate(`/item/${id}`);
  };

  // Format price in Indonesian Rupiah
  const formatRupiah = (value) => {
    if (typeof value === "string") value = value.replace(/[^\d]/g, "");
    const number = Number(value);
    if (isNaN(number)) return value;
    return "Rp " + number.toLocaleString("id-ID");
  };

  return (
    <div
      className="ItemBox"
      onClick={handleBoxClick}
      style={{ cursor: "pointer" }}
    >
      
      <h2>{title}</h2>
      <img src={image} alt={title} className="product-image" />
      <div className="price">{formatRupiah(price)}</div>
      <div className="location">Location: {location}</div>
      {!isSold && (
        <button
          className="mark-as-sold"
          onClick={(e) => {
            e.stopPropagation();
            if (onMarkAsSold) onMarkAsSold();
          }}
          disabled={false}
          title={
            isOwnItem ? "You cannot purchase your own item" : "Mark as Sold"
          }
        >
          Mark as Sold
        </button>
      )}
    </div>
  );
};

export default ItemBox;
