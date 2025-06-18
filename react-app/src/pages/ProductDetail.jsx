import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import HeaderLogin from "../components/HeaderLogin";
import Header from "../components/Header";
import "./ProductDetail.css";

const ITEMS_API_BASE_URL = process.env.NEXT_PUBLIC_ITEMS_BACKEND_URL;
const LOGIN_API_BASE_URL = process.env.NEXT_PUBLIC_LOGIN_BACKEND_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerName, setSellerName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);

    if (!ITEMS_API_BASE_URL || !LOGIN_API_BASE_URL) {
        console.error("Backend URLs are not configured!");
        // You might want to display an error message to the user or navigate away
        return;
    }

    fetch(`${ITEMS_API_BASE_URL}/items/${id}`)
      .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch item details');
          return res.json();
      })
      .then((data) => {
        setItem(data);
        fetch(
          `${LOGIN_API_BASE_URL}/profile?email=${encodeURIComponent(
            data.seller
          )}`
        )
          .then((res) => {
              if (!res.ok) throw new Error('Failed to fetch seller profile');
              return res.json();
          })
          .then((profile) => {
            const name = [profile.firstName, profile.lastName]
              .filter(Boolean)
              .join(" ");
            setSellerName(name || data.seller);
          })
          .catch((err) => {
                console.error("Error fetching seller profile:", err);
                setSellerName(data.seller); // Fallback to email if profile fetch fails
            });
      })
      .catch((err) => {
          console.error("Error fetching item:", err);
          setItem(null); // Clear item on error
      });
  }, [id]);

  useEffect(() => {
    if (!item) return;
    const stored = JSON.parse(localStorage.getItem("bookmarkedItems") || "[]");
    setBookmarked(stored.some((b) => b._id === item._id));
  }, [item]);

  useEffect(() => {
    if (location.state && location.state.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  const handleChatClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate("/Chatroom", {
      state: {
        selectedUser: { email: item.seller, name: sellerName },
      },
    });
  };

  const handleBookmark = () => {
    if (!item) return;
    let stored = JSON.parse(localStorage.getItem("bookmarkedItems") || "[]");
    if (bookmarked) {
      stored = stored.filter((b) => b._id !== item._id);
      setBookmarked(false);
    } else {
      stored.push(item);
      setBookmarked(true);
    }
    localStorage.setItem("bookmarkedItems", JSON.stringify(stored));
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/item/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      alert("Failed to copy link.");
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="product-detail-bg">
      {currentUser ? <HeaderLogin /> : <Header />}
      <div className="product-detail-grid">
        {/* Left Column - Image */}
        <div className="product-detail-image-card">
          <img
            src={`${ITEMS_API_BASE_URL}/uploads/${item.image}`}
            alt={item.title}
            className="product-detail-image"
          />
        </div>

        {/* Right Column - Details */}
        <div className="product-detail-details">
          {/* Price Card */}
          <div className="product-detail-price-card">
            <div className="product-detail-price-row">
              <h1 className="product-detail-price">
                Rp {item.price.toLocaleString()}
              </h1>
              <div className="product-detail-icons">
                <button
                  className="product-detail-icon"
                  onClick={handleShare}
                  title="Copy link"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  {/* Modern share SVG */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7ca850"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
                <button
                  className={`product-detail-icon bookmark-btn${
                    bookmarked ? " bookmarked" : ""
                  }`}
                  onClick={handleBookmark}
                  title={bookmarked ? "Remove Bookmark" : "Add to Bookmark"}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
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
              </div>
              {copied && (
                <span style={{ color: "#7ca850", marginLeft: 8, fontSize: 14 }}>
                  Link copied!
                </span>
              )}
            </div>
            <h2 className="product-detail-title">{item.title}</h2>
            <p className="product-detail-location">{item.location}</p>
          </div>

          {/* Seller Card */}
          {currentUser && item.seller !== currentUser.email && (
            <div className="product-detail-seller-card">
              <div className="product-detail-seller-row">
                <div className="product-detail-seller-avatar">
                  {sellerName ? sellerName[0] : "?"}
                </div>
                <div>
                  <div className="product-detail-seller-name">
                    {sellerName || item.seller}
                  </div>
                  <div className="product-detail-seller-member">
                    {item.seller}
                  </div>
                </div>
              </div>
              <button
                onClick={handleChatClick}
                className="product-detail-chat-btn"
              >
                Message Seller
              </button>
            </div>
          )}

          {/* Description Card */}
          <div className="product-detail-description-card">
            <h3 className="product-detail-description-title">Description</h3>
            <p className="product-detail-description">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
