import React, { useState, useContext } from 'react';
import { useUser, SignedIn, SignedOut } from '@clerk/clerk-react';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css';
import { UserProfile } from '@clerk/clerk-react';
import { ThemeContext } from '../../context/ThemeContext';

const Profile = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fallback for anonymous users (simulate login)
  const simulatedUser = {
    fullName: 'John Doe',
    emailAddress: 'johndoe@example.com',
    username: 'johndoe25',
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const displayUser = user
    ? {
        fullName: `${user.firstName} ${user.lastName}`,
        emailAddress: user.primaryEmailAddress?.emailAddress,
        username: user.username || user.id,
        id: user.id,
        createdAt: user.createdAt || new Date().toISOString(),
      }
    : simulatedUser;

  

  return (
    <div className="dashboard-wrapper {`profile-wrapper ${darkMode}`}">
      {/* Mobile hamburger */}
      <button className="hamburger" onClick={() => setSidebarOpen(true)}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="profile-container fade-in {`profile-wrapper ${darkMode}`}">
        <div className="profile-wrapper">
          <div className="profile-header">
            <h1 className="profile-title">👤 My Profile</h1>
            
            <div className="profile-buttons">
              <button onClick={toggleTheme} className="theme-toggle-icon" title="Toggle Theme">
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
              <SignedIn>
                <button
                  onClick={() => window.location.href = '/sign-out'}
                  className="logout-btn"
                >
                  🔓 Log Out
                </button>
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => window.location.href = '/sign-in'}
                  className="logout-btn"
                >
                  🔐 Sign In
                </button>
              </SignedOut>
            </div>
          </div>

          <div className="profile-card">
            <h2 className="section-title">User Info</h2>
            <div className="user-details">
              <p><strong>Full Name:</strong> {displayUser.fullName}</p>
              <p><strong>Email:</strong> {displayUser.emailAddress}</p>
              <p><strong>Username:</strong> {displayUser.username}</p>
              <p><strong>User ID:</strong> {displayUser.id}</p>
              <p><strong>Created At:</strong> {new Date(displayUser.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
