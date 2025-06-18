import React from 'react';
import './Header.css';
import logo from '/images/logo.png';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="furb logo" className="logo-img" />
        </Link>
      </div>

      <div className="header-center">
        <SearchBar className="search-bar"/>
      </div>

      <div className="header-right">
        <div className="auth-links">
          <Link to="/signup" className="nav-link">Sign up</Link>
          <span className="divider">|</span>
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;