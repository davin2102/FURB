/* eslint-disable no-unused-vars */
import HeaderLogin from "../components/HeaderLogin";
import "./Sell.css";
import ItemBox from "../components/ItemBox";
import tiktok from "/images/tiktok.png";
import instagram from "/images/instagram.png";
import facebook from "/images/facebook.png";
import { Link } from "react-router-dom";
import Profile from "/images/profile.png";
import { useState, useEffect } from "react";

const Sell = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const email = storedUser.email || "";
  const [user, setUser] = useState({});
  useEffect(() => {
    if (!email) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/profile?email=${encodeURIComponent(email)}`
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
    fetchUser();
  }, [email]);
  const { firstName = "User", lastName = "", gender = "", bio = "" } = user;
  const [items, setItems] = useState([]);
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
    fetch("http://localhost:5002/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const handleItemChange = (e) => {
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    // You can also display a preview of the image here
    // using URL.createObjectURL(file)
  };

  // Handle form submit
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", itemForm.title);
      formData.append("description", itemForm.description);
      formData.append("price", Number(itemForm.price));
      formData.append("location", itemForm.location);
      formData.append("image", selectedImage); // Append the image file
      formData.append("seller", email);

      console.log("Form Data:", formData); // Log the FormData object

      const response = await fetch("http://localhost:5002/items", {
        method: "POST",
        body: formData, // Send FormData instead of JSON
      });

      console.log("Response Status:", response.status); // Log the response status

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
        // Refresh items list
        const newItems = await fetch("http://localhost:5002/items").then(
          (res) => res.json()
        );
        setItems(newItems);
      } else {
        const errorText = await response.text();
        alert(`Failed to add item: ${errorText}`); // Display the error message
      }
    } catch (error) {
      console.error("Error adding item:", error); // Log the error
      alert(`Error adding item: ${error.message}`); // Display the error message
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
              <ItemBox
                key={item._id}
                id={item._id}
                title={item.title}
                price={item.price}
                image={item.imageUrl || item.image}
                location={item.location}
                seller={item.seller}
              />
            ))}
        </div>
      </div>
      <div className="bottom-section">
        <div className="sold-items">
          <h2>Sold Items</h2>
          <div className="sold-list">
            {[...Array(6)].map((_, i) => (
              <div className="sold-card" key={i}></div>
            ))}
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
              accept="image/*" // Accept only image files
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
