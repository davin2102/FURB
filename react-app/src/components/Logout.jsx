import React from 'react';
import './Logout.css';
import logo from '/images/logo_2.png'; // Adjust the path as necessary

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="logout-container">
      <img src={logo} alt="Logo Furb" className='logo'/>
      <h1 className="confirmation-text">Are you sure you wanna<br />log out?</h1>
      <div className='button-group'>
        <button 
              onClick={handleLogout}
              className="logout-button confirm-button"
            >
              Yes, Log Me Out
            </button>
            <button 
              onClick={() => window.location.href = '/editprofile'}
              className="logout-button cancel-button"
            >
              Nah, Just Kidding
            </button>
      </div>
    </div>
  );
};

export default Logout;