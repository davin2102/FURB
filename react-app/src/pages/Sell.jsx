import HeaderLogin from "../components/HeaderLogin";
import './Sell.css';
import ItemBox from "../components/ItemBox";
import tiktok from '/images/tiktok.png';
import instagram from '/images/instagram.png';
import facebook from '/images/facebook.png';
import { Link } from "react-router-dom";
import Profile from '/images/profile.png';
import { useState, useEffect} from "react";

const Sell = () => {
    // Get email from localStorage (if user is logged in)
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const email = storedUser.email || '';
    // Use state to keep user info in sync with backend
    const [user, setUser] = useState({});
    useEffect(() => {
        if (!email) return;
        // Fetch user info from backend
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:5000/profile?email=${encodeURIComponent(email)}`);
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

    return (
        <div className="sell-page">
            <HeaderLogin />
            <div className="profile-section">
                <div className="profile-banner">
                    <img className="banner-img" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" alt="Banner" />
                    <div className="profile-info">
                        <img className="profile-avatar" src={Profile} alt="Profile Avatar" />
                        <div>
                            <div className="profile-name">
                                {firstName} {lastName} {gender && <span className="profile-gender">{gender}</span>}
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
                <div className="activity-section">
                    <h4>Your Activity</h4>
                    <ul>
                        <li><span>02/06/2025</span> You listed an item!</li>
                        <li><span>11/01/2025</span> You bought an item!</li>
                        <li><span>29/10/2024</span> You listed an item!</li>
                    </ul>
                </div>
            </div>
            <div className="list-section">
                <div className="list-header">
                    <h2>Your List</h2>
                    <input className="search-input" placeholder="Find Item Name" />
                </div>
                <div className="item-list">
                    {[...Array(6)].map((_, i) => (
                        <div className="item-card" key={i}></div>
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
                    <form>
                        <label>Item name</label>
                        <input type="text" />
                        <label>Description</label>
                        <textarea rows={3}></textarea>
                        <label>Price</label>
                        <input type="text" />
                        <label>Location</label>
                        <input type="text" />
                        <label>Insert Image</label>
                        <div className="upload-box">
                            <span className="upload-icon">⬆️</span>
                        </div>
                        <button type="submit" className="add-btn">Add Item</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Sell;