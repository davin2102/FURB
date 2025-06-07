import React, { useState } from 'react';
import './LoginForm.css'; // Reusing the same CSS file
import logo from '/images/logo_2.png'; // Assuming logo is used in the header

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    gender: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dob: formData.dob,
          gender: formData.gender,
          bio: formData.bio,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });
      const result = await response.text();
      if (result === "Signup successful!") {
        window.location.href = "/Login";
      } else {
        alert(result);
      }
    } catch (error) {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
        <div className="login-container">
            <div className="login-header">
                <div className='logo'>
                  <img src={logo} alt="Logo" />
                </div>
                <h1>Sign up</h1>
            </div>
      
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName"></label>
                            <input
                                placeholder="First Name"
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                    </div>
          
                    <div className="form-group">
                      <label htmlFor="lastName"></label>
                      <input
                        placeholder="Last Name"
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob"></label>
            <input
              placeholder="Date of Birth"
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gender"></label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="bio"></label>
            <input
              placeholder="Bio (optional)"
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password"></label>
            <input
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword"></label>
            <input
              placeholder="Confirm Password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="login-button">register</button>
      </form>
    </div>
    </div>
    
  );
};

export default SignUp;