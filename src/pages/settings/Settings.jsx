import React, { useState, useEffect, useContext } from 'react';
import { UserButton, useUser, useClerk, UserProfile } from '@clerk/clerk-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { FaBars, FaUserEdit } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './settings.css';
import { ThemeContext } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useUser();
  const { signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // ✅ Success toast when Clerk profile is updated
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.clerk_event === 'user_profile_updated') {
        toast.success('✅ Profile updated successfully!');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ✅ Confirm before logout
  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      await signOut();
      toast.success('🚪 Logged out successfully');
    }
  };

  // ✅ Confirm before account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '⚠️ Are you sure you want to delete your account? This cannot be undone!'
    );
    if (confirmDelete) {
      try {
        await user.delete();
        toast.success('💥 Account deleted successfully');
      } catch (err) {
        console.error(err);
        toast.error('❌ Failed to delete account.');
      }
    }
  };

  return (
    <div className="dashboard-wrapper {`settings-wrapper ${darkMode}`}">
      {/* Hamburger for mobile */}
      <button className="hamburger" onClick={() => setSidebarOpen(true)}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />

      {/* Main Content */}
      {/* <motion.div
        className="settings-container fade-in"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      > */}
        <div className="settings-wrapper {`settings-wrapper ${darkMode}`}">
          <div className="settings-header">
            <h1 className="settings-title">⚙️ Settings</h1>
            <div className="top__div">
              <button onClick={toggleTheme} className="theme-toggle-icon" title="Toggle Theme">
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>

          {/* Edit Profile */}
          <div className="settings-card">
            <button
              onClick={() => setShowEditProfile(!showEditProfile)}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaUserEdit /> {showEditProfile ? 'Hide' : 'Edit'} Profile
            </button>

            {showEditProfile && (
              <div className="clerk-profile" style={{ marginTop: '1rem' }}>
                <UserProfile path="/settings" routing="path" />
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="settings-card">
            <h2 className="section-title">🛠️ Manage Your Preferences</h2>
            <div className="settings-options">
              <div className="option-row">
                <span>🔔 Enable Notifications</span>
                <input type="checkbox" />
              </div>
              <div className="option-row">
                <span>🛡️ Require Auth for Sensitive Actions</span>
                <input type="checkbox" />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-card danger-zone">
            <h2 className="section-title">⚠️ Account Actions</h2>
            <button onClick={handleLogout} className="btn-secondary">🚪 Logout</button>
            <button onClick={handleDeleteAccount} className="btn-danger all-buttons">❌ Delete My Account</button>
          </div>

          {/* Footer Info */}
          {user && (
            <div className="footer-info">
              <p><strong>Logged in as:</strong> {user.fullName || user.username}</p>
              <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
            </div>
          )}
        </div>
      {/* </motion.div> */}
    </div>
  );
};

export default Settings;
