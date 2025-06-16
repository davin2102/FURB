/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import HeaderLogin from "../components/HeaderLogin";

const ProductDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sellerName, setSellerName] = useState(""); // NEW
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    fetch(`http://localhost:5002/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        fetch(`http://localhost:5000/profile?email=${encodeURIComponent(data.seller)}`)
          .then(res => res.json())
          .then(profile => {
            const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
            setSellerName(name || data.seller);
          })
          .catch(() => setSellerName(data.seller));
      });
  }, [id]);

  useEffect(() => {
    if (location.state && location.state.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  const handleChatClick = () => {
    if (!currentUser) {
      alert("Please login to chat with the seller");
      navigate("/login");
      return;
    }
    // Navigate to Chatroom with seller email
    navigate('/Chatroom', { 
      state: { 
        selectedUser: { email: item.seller, name: sellerName }
      }
    });
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div style={{ backgroundColor: "#f2f4f5", minHeight: "100vh" }}>
      <HeaderLogin />
      <div style={{ 
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px"
      }}>
        {/* Left Column - Image */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "4px",
          padding: "20px"
        }}>
          <img
            src={`http://localhost:5002/uploads/${item.image}`}
            alt={item.title}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "4px"
            }}
          />
        </div>

        {/* Right Column - Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Price Card */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "4px",
            padding: "20px"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h1 style={{
                fontSize: "32px",
                fontWeight: "600",
                color: "#002f34",
                margin: "0"
              }}>Rp {item.price.toLocaleString()}</h1>
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontSize: "24px", cursor: "pointer" }}>⤴</span>
                <span style={{ fontSize: "24px", cursor: "pointer" }}>♡</span>
              </div>
            </div>
            <h2 style={{
              fontSize: "20px",
              fontWeight: "normal",
              margin: "12px 0"
            }}>{item.title}</h2>
            <p style={{
              color: "#666",
              margin: "0"
            }}>{item.location}</p>
          </div>

          {/* Seller Card */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "4px",
            padding: "20px"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#002f34",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px"
              }}>
                {sellerName ? sellerName[0] : "?"}
              </div>
              <div>
                <div style={{ fontWeight: "600" }}>{sellerName || item.seller}</div>
                <div style={{ color: "#666", fontSize: "14px" }}>Member since 2023</div>
              </div>
            </div>

            <button
              onClick={handleChatClick}
              style={{
                width: "100%",
                backgroundColor: "#002f34",
                color: "white",
                padding: "12px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "12px"
              }}
            >
              Chat Dengan Penjual
            </button>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#666",
              fontSize: "14px"
            }}>
            </div>
          </div>

          {/* Description Card */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "4px",
            padding: "20px"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "12px"
            }}>Deskripsi</h3>
            <p style={{ color: "#666" }}>{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;