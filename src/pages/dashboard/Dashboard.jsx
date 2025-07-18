import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../../components/sidebar/Sidebar';
import { useAuth } from '@clerk/clerk-react';
import './dashboard.css';
import { FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem('passwords');
    return stored ? JSON.parse(stored) : [];
  });
  const [newEntry, setNewEntry] = useState({ name: '', username: '', password: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('save'); // 'save' or 'delete'
  const formRef = useRef(null);

  const { getToken } = useAuth(); // 🔐 Clerk token access

  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(entries));
  }, [entries]);

  const handleChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);

    // 🔐 Send to backend with Clerk auth
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/passwords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEntry),
      });

      const data = await res.json();
      console.log('Server response:', data);
    } catch (err) {
      console.error('Failed to save to backend:', err);
    }

    setNewEntry({ name: '', username: '', password: '' });
    
    // Show success animation
    setAnimationType('save');
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000); // Hide after 3 seconds
  };

  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    
    // Show delete animation
    setAnimationType('delete');
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000); // Hide after 3 seconds
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredEntries = entries.filter((entry) =>
    entry.name.toLowerCase().includes(searchTerm)
  );

  const { theme, toggleTheme} = useContext(ThemeContext);

  return (
    <div className="dashboard-wrapper">
      <button className="hamburger" onClick={() => setSidebarOpen(true)}>
        <FaBars />
      </button>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Success Animation Notification */}
      {showSuccessAnimation && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className={`confetti confetti-${i % 6}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            <div className="success-circle">
              <div className="success-icon-large">
                {animationType === 'save' ? '✅' : '🗑️'}
              </div>
            </div>
            <div className="success-message">
              {animationType === 'save' ? 'Password Saved Successfully!' : 'Password Deleted Successfully!'}
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-container">
        <div className="header">
          <h1 className="dashboard-title">🔐 TAS-PASS</h1>
          <button onClick={toggleTheme} className="theme-toggle-icon" title="Toggle Theme">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="top-bar">
          <input
            type="text"
            placeholder="🔍 Search by site name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar form"
          />
          <button onClick={scrollToForm} className="add-btn">
            ➕ Add New
          </button>
        </div>

        <div className="password-section">
          <h2>🔒 Stored Passwords</h2>
          <button onClick={() => setShowPasswords(!showPasswords)} className="toggle-btn all_buttons" >
            {showPasswords ? '🙈 Hide Passwords' : '👁️ Show Passwords'}
          </button>

          <div className="entries">
            {filteredEntries.length === 0 ? (
              <p className="no-entries">No matching passwords found.</p>
            ) : (
              filteredEntries.map((entry, index) => (
                <div key={index} className={`entry theme-${index % 4}`}>
                  <h3>{entry.name}</h3>
                  <p>👤 {entry.username}</p>
                  <p>
                    🔑 {showPasswords ? entry.password : '*'.repeat(entry.password.length)}
                  </p>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    ❌
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="form-section" ref={formRef}>
          <h2>Add New Entry</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="name"
              className='form_input'
              placeholder="Website Name"
              value={newEntry.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              className='form_input'
              placeholder="Username or Email"
              value={newEntry.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              className='form_input'
              placeholder="Password"
              value={newEntry.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className='all_buttons'>💾 Save Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;