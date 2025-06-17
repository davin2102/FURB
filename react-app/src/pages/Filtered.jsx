import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ItemBox from "../components/ItemBox";
import HeaderLogin from "../components/HeaderLogin";
import Footer from "../components/Footer";

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
    fetch(`http://localhost:5002/items/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
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