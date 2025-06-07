import Header from '../components/Header';
import Advertisement from '../components/Advertisement';
import './Home.css';
import ItemBox from '../components/ItemBox';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="home-page">
            <Header />
            <Advertisement />
            <Content />
            <Footer />
        </div>
    );
};

const products = [
  { id: 1, title: 'Product 1', price: '$99.99', image: 'https://via.placeholder.com/150', location: 'Jakarta' },
  { id: 2, title: 'Product 2', price: '$79.99', image: 'https://via.placeholder.com/150', location: 'Bandung' },
  { id: 3, title: 'Product 3', price: '$59.99', image: 'https://via.placeholder.com/150', location: 'Surabaya' },
  { id: 4, title: 'Product 4', price: '$39.99', image: 'https://via.placeholder.com/150', location: 'Bali' },
  { id: 5, title: 'Product 5', price: '$99.99', image: 'https://via.placeholder.com/150', location: 'Jakarta' },
  { id: 6, title: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', location: 'Bandung' },
  { id: 7, title: 'Product 7', price: '$59.99', image: 'https://via.placeholder.com/150', location: 'Surabaya' },
  { id: 8, title: 'Product 8', price: '$39.99', image: 'https://via.placeholder.com/150', location: 'Bali' }
];

const Content = () => {
  return (
    <div className="content">
      <div className="section-header">
        <h1 className="content-title">Recommended For You</h1>
        <button className="content-view-all">view all</button>
      </div>
      <div className="products-row">
        {products.map(product => (
          <ItemBox
            key={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            location={product.location}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;