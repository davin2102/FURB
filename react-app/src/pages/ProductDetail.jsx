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

    fetch(`<span class="math-inline">\{ITEMS\_API\_BASE\_URL\}/items/</span>{id}`)
      .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch item details');
          return res.json();
      })
      .then((data) => {
        setItem(data);
        fetch(
          `<span class="math-inline">\{LOGIN\_API\_BASE\_URL\}/profile?email\=</span>{encodeURIComponent(
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
    const url = `<span class="math-inline">\{window\.location\.origin\}/item/</span>{id}`;
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
            src={`<span class="math-inline">\{ITEMS\_API\_BASE\_URL\}/uploads/</span>{item.image}`}
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
