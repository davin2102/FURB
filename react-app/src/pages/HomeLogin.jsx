import Header from "../components/HeaderLogin"; 
import Advertisement from "../components/Advertisement";
import "./Home.css"; 
import ItemBox from "../components/ItemBox";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

// Use environment variable for the items backend URL
const ITEMS_API_BASE_URL = process.env.NEXT_PUBLIC_ITEMS_BACKEND_URL;

const Home = () => { 
  const [items, setItems] = useState([]);
  useEffect(() => {
    
    if (!ITEMS_API_BASE_URL) {
        console.error("ITEMS_BACKEND_URL environment variable is not set!");
        setItems([]); 
        return;
    }
    fetch(`${ITEMS_API_BASE_URL}/items`)
      .then((res) => {
        if (!res.ok) { // Basic error handling for fetch
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
      .then((data) => setItems(data))
      .catch((err) => { // Catch network or JSON parsing errors
        console.error("Failed to fetch items for Home (LoggedIn) page:", err);
        setItems([]); // Clear items on error
    });
  }, []);
  return (
    <div className="home-page">
      <Header /> {/* This will render HeaderLogin */}
      <Advertisement />
      <Content items={items} />
      <Footer />
    </div>
  );
};

const Content = ({ items }) => {
  const [showAll, setShowAll] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user && user.email ? user.email : null;
  
  // Filter out items from the current user
  const filteredItems = userEmail
    ? items.filter((item) => item.seller !== userEmail)
    : items;
  
  // Determine which items to display based on showAll state
  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 8);

  return (
    <div className="content">
      <div className="section-header">
        <h1 className="content-title">Recommended For You</h1>
        {filteredItems.length > 8 && (
          <button 
            className="content-view-all" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "show less" : "view all"}
          </button>
        )}
      </div>
      <div className="products-row">
        {displayedItems.map((item) => (
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
  );
};

export default Home;
