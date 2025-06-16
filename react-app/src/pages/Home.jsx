import Header from '../components/Header';
import Advertisement from '../components/Advertisement';
import './Home.css';
import ItemBox from '../components/ItemBox';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';

const Home = () => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5002/items")
            .then(res => res.json())
            .then(data => setItems(data));
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
  return (
    <div className="content">
      <div className="section-header">
        <h1 className="content-title">Recommended For You</h1>
        <button className="content-view-all">view all</button>
      </div>
      <div className="products-row">
        {items.map(item => (
          <ItemBox
            key={item._id}
            title={item.title}
            price={item.price}
            image={item.image}
            location={item.location}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;