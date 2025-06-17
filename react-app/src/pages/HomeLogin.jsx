import Header from "../components/HeaderLogin";
import Advertisement from "../components/Advertisement";
import "./Home.css";
import ItemBox from "../components/ItemBox";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const Home = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5002/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);
  return (
    <div className="home-page">
      <Header />
      <Advertisement />
      <Content items={items} />
      <Footer />
    </div>
  );
};

const Content = ({ items }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user && user.email ? user.email : null;
  const filteredItems = userEmail
    ? items.filter((item) => item.seller !== userEmail)
    : items;
  return (
    <div className="content">
      <div className="section-header">
        <h1 className="content-title">Recommended For You</h1>
        <button className="content-view-all">view all</button>
      </div>
      <div className="products-row">
        {filteredItems.map((item) => (
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
