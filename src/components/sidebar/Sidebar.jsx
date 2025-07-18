import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaLock, FaUser, FaCog, FaEdit, FaTimes, FaKey } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile header */}
      <div className="sidebar-header mobile-only">
        <h2>TAS-PASS</h2>
        <button onClick={onClose} className="close-btn">
          <FaTimes />
        </button>
      </div>

      {/* Desktop title */}
      <h2 className="app-title desktop-only">🔐 TAS-PASS</h2>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          <FaHome /> <span>Home</span>
        </NavLink>
        <NavLink
          to="/vault"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          <FaLock /> <span>Vault</span>
        </NavLink>
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          <FaUser /> <span>Profile</span>
        </NavLink>
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          <FaCog /> <span>Settings</span>
        </NavLink>
        <NavLink
          to="/edit-profile"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          <FaEdit /> <span>Edit Profile</span>
        </NavLink>
        <NavLink
          to="/password-generator"
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
        >
          <FaKey /> <span>Password Generator</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
