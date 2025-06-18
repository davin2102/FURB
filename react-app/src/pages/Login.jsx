/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './LoginForm.css'; // We'll create this CSS file next
import logo from '/images/logo_2.png'; // Adjust the path as necessary

const LOGIN_API_BASE_URL = process.env.NEXT_PUBLIC_LOGIN_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    // ...existing code...
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${LOGIN_API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (result && result.message === 'Login successful!') {
      localStorage.setItem('user', JSON.stringify({ email }));
      window.location.href = '/HomeLogin';
    } else {
      const text = result && result.message ? result.message : await response.text();
      alert(text);
    }
  } catch (err) {
    alert('Login failed. Please try again.');
  }
};
// ...existing code...
  // ...existing code...
  return (
    <div className='login-page'>
      <div className="login-container">
        
      <div className="login-header">
        <div className='logo'>
          <img src={logo} alt="Logo" />
        </div>
        <h1>User Login</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email"></label>
          <input
            placeholder='Email'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password"></label>
          <input
            placeholder='Password'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="forgot-password">
            <a href="/Signup">Don't have an Account? Click here!</a>
          </div>
        </div>
        
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
    </div>
    
  );
};

export default Login;
