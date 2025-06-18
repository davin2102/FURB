/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import HeaderLogin from "../components/HeaderLogin";
import Logout from "../components/Logout";

// Use environment variable for the backend URL
const LOGIN_API_BASE_URL = process.env.NEXT_PUBLIC_LOGIN_BACKEND_URL;

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    birthDate: '',
    email: '',
    gender: ''
  });
  const [activeTab, setActiveTab] = useState('edit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get user email from localStorage (same as login)
  useEffect(() => {
    if (activeTab !== 'edit') return;
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) return;
    setLoading(true);
    setError('');
    // --- UPDATED API CALL 1 ---
    fetch(`<span class="math-inline">\{LOGIN\_API\_BASE\_URL\}/profile?email\=</span>{encodeURIComponent(user.email)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load profile.');
        setLoading(false);
      });
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = { ...formData, dob: formData.birthDate };
    // --- UPDATED API CALL 2 ---
    fetch(`${LOGIN_API_BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    })
    .then((data) => {
      setLoading(false);
      if (data && data.user) {
        localStorage.setItem('user', JSON.stringify({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          bio: data.user.bio,
          birthDate: data.user.dob ? (typeof data.user.dob === 'string' ? data.user.dob : new Date(data.user.dob).toISOString().split('T')[0]) : '',
          gender: data.user.gender
        }));
      }
      navigate('/HomeLogin');
    })
    .catch(() => {
      setError('Could not update profile.');
      setLoading(false);
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    try {
        // --- UPDATED API CALL 3 ---
      const res = await fetch(`${LOGIN_API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
