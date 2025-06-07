import React from 'react';
import './Header.css';
import logo from '/images/logo.png';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import Profile from '/images/profile.png';
import Chaticon from '/images/chat-icon.png';

const HeaderLogin = () => {
  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/HomeLogin" className="logo-link">
          <img src={logo} alt="furb logo" className="logo-img" />
        </Link>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-right">
        <div className="icon-container">
            <Link to="/Chatroom">
                <img src={Chaticon} alt="chat icon" className='Chat-icon'/>
            </Link>
            {/* <Link to ="/Sell" className='sell-button'>
                <span>+ Sell</span>
                </Link> */}
          <Link to="/Sell">
            <img src={Profile} alt="profile picture" className='Profile'/>
          </Link>
            
        </div>
      </div>
    </header>
  );
};

export default HeaderLogin;