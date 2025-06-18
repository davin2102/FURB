import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ItemBox from "../components/ItemBox";
import HeaderLogin from "../components/HeaderLogin";
import Footer from "../components/Footer";

// Use environment variable for the items backend URL
const ITEMS_API_BASE_URL = process.env.NEXT_PUBLIC_ITEMS_BACKEND_URL;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Filtered = () => {
  const query = useQuery().get("q") || "";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    // Add a check for the environment variable being set
    if (!ITEMS_API_BASE_URL) {
        console.error("ITEMS_BACKEND_URL environment variable is not set!");
        setLoading(false);
        setItems([]); // Clear items if URL is not set
        return;
    }
    fetch(`${ITEMS_API_BASE_URL}/items/search?q=${encodeURIComponent(query)}`) // UPDATED LINE
      .then(res => {
        if (!res.ok) { // Basic error handling for fetch
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => { // Catch network or JSON parsing errors
        console.error("Failed to fetch filtered items:", err);
        setItems([]); // Clear items on error
        setLoading(false);
    });
  }, [query]);

  return (
    <div className="home-page">
      <HeaderLogin />
      <div className="content">
        <div className="section-header">
          <h1 className="content-title">
            Search results for: <span style={{ color: "#7ca850" }}>{query}</span>
          </h1>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div>No items found.</div>
        ) : (
          <div className="products-row">
            {items.map(item => (
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Filtered;
