import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import HeaderLogin from '../components/HeaderLogin';
import Logout from '../components/Logout';

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
    fetch(`http://localhost:5000/profile?email=${encodeURIComponent(user.email)}`)
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
    // Send dob instead of birthDate for backend compatibility
    const payload = { ...formData, dob: formData.birthDate };
    fetch('http://localhost:5000/profile', {
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
      // Update localStorage with latest profile info from backend
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
      const res = await fetch('http://localhost:5000/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        alert('Password changed successfully!');
        setActiveTab('edit');
      } else if (data.error === 'Current password is incorrect') {
        alert('Current password is incorrect.');
      } else {
        setError(data.error || 'Could not change password.');
      }
    } catch (err) {
      setError('Could not change password.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <HeaderLogin />

      <div className="main-content">
        <aside className="sidebar">
          <h2>YOUR ACCOUNT</h2>
          <nav>
            <a href="#" className={activeTab === 'edit' ? 'active' : ''} onClick={() => setActiveTab('edit')} >Edit Profile</a>
            <a href="#" className={activeTab === 'password' ? 'active' : ''} onClick={() => setActiveTab('password')}>Change Password</a>
            <a href="#" className={activeTab === 'bookmarks' ? 'active' : ''} onClick={() => setActiveTab('bookmarks')}>Bookmarks</a>
            <a href="#" className={activeTab === 'help' ? 'active' : ''} onClick={() => setActiveTab('help')}>Help</a>
            <a href="#" className={activeTab === 'privacy' ? 'active' : ''} onClick={() => setActiveTab('privacy')}>Privacy Center</a>
            <a href="#" className={activeTab === 'logout' ? 'active' : ''} onClick={() => setActiveTab('logout')}>Logout</a>
          </nav>
        </aside>

        <main className="form-container">
          {/* Edit Profile tab */}
          {activeTab === 'edit' && (
            <>
              <h2>Edit Profile</h2>
              {loading && <div>Loading...</div>}
              {error && <div style={{color:'red'}}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Birth Date</label>
                    <input 
                      type="date" 
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button type="submit">Submit</button>
              </form>
            </>
          )}

          {/* Change Password tab */}
          {activeTab === 'password' && (
            <>
              <h2>Change Password</h2>
              {loading && <div>Loading...</div>}
              {error && <div style={{color:'red'}}>{error}</div>}
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" name="currentPassword" required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" required />
                </div>
                <button type="submit">Change Password</button>
              </form>
            </>  
          )}

          {/* Bookmarks tab */}
          {activeTab === 'bookmarks' && (
            <div>
              <h2>Your Bookmarks</h2>
              <p>No bookmarks yet.</p>
            </div>
          )}

          {/* Help tab */}
          {activeTab === 'help' && (
            <div>
              <h2>Help</h2>
              <p>For assistance, please contact support.</p>
            </div>
          )}

          {/* Privacy Center tab */}
          {activeTab === 'privacy' && (
            <div>
              <h2>Privacy Center</h2>
              <p>Manage your privacy settings here.</p>
            </div>
          )}

          {/* Logout Tab */}
          {activeTab === 'logout' && (
            <div>
              <Logout />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditProfile;