/* eslint-disable no-unused-vars */
import HeaderLogin from "../components/HeaderLogin";
import "./Sell.css";
import ItemBox from "../components/ItemBoxSeller";
import tiktok from "/images/tiktok.png";
import instagram from "/images/instagram.png";
import facebook from "/images/facebook.png";
import { Link } from "react-router-dom";
import Profile from "/images/profile.png";
import { useState, useEffect } from "react";

const LOGIN_API_BASE_URL = process.env.NEXT_PUBLIC_LOGIN_BACKEND_URL;
const ITEMS_API_BASE_URL = process.env.NEXT_PUBLIC_ITEMS_BACKEND_URL;

const Sell = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const email = storedUser.email || "";
  const [user, setUser] = useState({});
  const [items, setItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [search, setSearch] = useState("");
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!email || !LOGIN_API_BASE_URL || !ITEMS_API_BASE_URL) {
        console.error("Backend URLs or user email are not configured!");
        return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${LOGIN_API_BASE_URL}/profile?email=${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser({});
        }
      } catch (err) {
        setUser({});
      }
    };

    const fetchItems = async () => {
      try {
        const res = await fetch(`${ITEMS_API_BASE_URL}/items`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    const fetchSoldItems = async () => {
      try {
        const res = await fetch(
          `${ITEMS_API_BASE_URL}/sold-items?email=${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSoldItems(data);
        }
      } catch (err) {
        console.error("Error fetching sold items:", err);
      }
    };

    fetchUser();
    fetchItems();
    fetchSoldItems();
  }, [email]);

  const { firstName = "User", lastName = "", gender = "", bio = "" } = user;

  const handleItemChange = (e) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!ITEMS_API_BASE_URL) {
        alert("Items backend URL is not configured. Cannot add item.");
        return;
    }
    try {
      const formData = new FormData();
      formData.append("title", itemForm.title);
      formData.append("description", itemForm.description);
      formData.append("price", Number(itemForm.price));
      formData.append("location", itemForm.location);
      formData.append("image", selectedImage);
      formData.append("seller", email);

      const response = await fetch(`${ITEMS_API_BASE_URL}/items`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Item added!");
        setItemForm({
          title: "",
          description: "",
          price: "",
          location: "",
          image: "",
        });
        setSelectedImage(null);
        const newItems = await fetch(`${ITEMS_API_BASE_URL}/items`).then(
          (res) => res.json()
        );
        setItems(newItems);
      } else {
        const errorText = await response.text();
        alert(`Failed to add item: ${errorText}`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert(`Error adding item: ${error.message}`);
    }
  };

  const handleMarkAsSold = async (itemId) => {
    if (!ITEMS_API_BASE_URL) {
        alert("Items backend URL is not configured. Cannot mark item as sold.");
        return;
    }
    try {
      // 1. Get the item details
      const itemResponse = await fetch(`${ITEMS_API_BASE_URL}/items/${itemId}`);
      if (!itemResponse.ok) throw new Error("Failed to fetch item");
      const item = await itemResponse.json();

      // 2. Add to sold items
      const soldResponse = await fetch(`${ITEMS_API_BASE_URL}/sold-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          price: item.price,
          location: item.location,
          image: item.image,
          seller: item.seller,
        }),
      });

      if (!soldResponse.ok) throw new Error("Failed to mark as sold");

      // 3. Delete from active items
      const deleteResponse = await fetch(
        `${ITEMS_API_BASE_URL}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      if (!deleteResponse.ok) throw new Error("Failed to delete item");

      // 4. Update state (use itemId, not item._id)
      setItems((prev) => prev.filter((i) => i._id !== itemId));
      const newSoldItem = await soldResponse.json();
      setSoldItems((prev) => [...prev, newSoldItem]);
    } catch (error) {
      console.error("Error marking item as sold:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="sell-page">
      <HeaderLogin />
      <div className="profile-section">
        <div className="profile-banner">
          <img
            className="banner-img"
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="Banner"
          />
          <div className="profile-info">
            <img
              className="profile-avatar"
              src={Profile}
              alt="Profile Avatar"
            />
            <div>
              <div className="profile-name">
                {firstName} {lastName}{" "}
                {gender && <span className="profile-gender">{gender}</span>}
              </div>
              <div className="profile-bio">{bio || "no bio"}</div>
            </div>
            <div className="profile-actions">
              <div className="profile-socials">
                <img className="icon" src={facebook} alt="Facebook" />
                <img className="icon" src={instagram} alt="Instagram" />
                <img className="icon" src={tiktok} alt="TikTok" />
              </div>
              <Link to="/editprofile">
                <button className="edit-profile-btn">Edit Profile</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="list-section">
        <div className="list-header">
          <h2>Your List</h2>
          <input
            className="search-input"
            placeholder="Find Item Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="item-list">
          {items
            .filter(
              (item) =>
                item.seller === email &&
                (item.title || "").toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <div className="item-with-button" key={item._id}>
                <ItemBox
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  price={item.price}
                  image={item.imageUrl || item.image}
                  location={item.location}
                  seller={item.seller}
                  isSold={false}
                  onMarkAsSold={() => handleMarkAsSold(item._id)}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="bottom-section">
        <div className="sold-items">
          <h2>Sold Items</h2>
          <div className="sold-list">
            {soldItems.length > 0 ? (
              soldItems.map((item) => (
                <ItemBox
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  price={item.price}
                  image={item.imageUrl || item.image}
                  location={item.location}
                  seller={item.seller}
                  isSold={true}
                />
              ))
            ) : (
              <p>No sold items yet</p>
            )}
          </div>
        </div>
        <div className="add-item">
          <h2>Add Item to list</h2>
          <form onSubmit={handleAddItem}>
            <label>Item name</label>
            <input
              type="text"
              name="title"
              value={itemForm.title}
              onChange={handleItemChange}
              required
            />
            <label>Description</label>
            <textarea
              rows={3}
              name="description"
              value={itemForm.description}
              onChange={handleItemChange}
            />
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={itemForm.price}
              onChange={handleItemChange}
              required
            />
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={itemForm.location}
              onChange={handleItemChange}
              required
            />
            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button type="submit" className="add-btn">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sell;
