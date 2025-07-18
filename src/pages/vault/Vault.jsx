import { React, useState, useEffect, useContext } from 'react';
import { FaLock, FaBars } from 'react-icons/fa';
// import { motion } from 'framer-motion';
import Sidebar from '../../components/sidebar/Sidebar';
import './vault.css';
import { ThemeContext } from '../../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const defaultCategories = ['All', 'Work', 'School', 'Personal'];

const Vault = () => {
  const { theme, toggleTheme} = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entries, setEntries] = useState(() => {
    const stored = localStorage.getItem('vaultItems');
    return stored ? JSON.parse(stored) : [];
  });

  const [filter, setFilter] = useState('All');
  const [newItem, setNewItem] = useState({ name: '', username: '', password: '', category: 'Personal' });
  const [isAdding, setIsAdding] = useState(false);
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('vaultCategories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('item'); // 'item', 'category', 'delete'

  useEffect(() => {
    localStorage.setItem('vaultItems', JSON.stringify(entries));
    localStorage.setItem('vaultCategories', JSON.stringify(categories));
  }, [entries, categories]);

  const showAnimation = (type) => {
    setAnimationType(type);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    setEntries([...entries, newItem]);
    setNewItem({ name: '', username: '', password: '', category: 'Personal' });
    setIsAdding(false);
    showAnimation('item');
  };

  const handleDeleteItem = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    showAnimation('delete');
  };

  const filteredEntries = filter === 'All'
    ? entries
    : entries.filter(entry => entry.category === filter);

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      showAnimation('category');
    }
  };

  const getAnimationContent = () => {
    switch (animationType) {
      case 'item':
        return {
          icon: '🔐',
          message: 'Vault Item Added Successfully!',
          color: 'linear-gradient(135deg, #4CAF50, #45a049)'
        };
      case 'category':
        return {
          icon: '📂',
          message: 'Category Added Successfully!',
          color: 'linear-gradient(135deg, #2196F3, #1976D2)'
        };
      case 'delete':
        return {
          icon: '🗑️',
          message: 'Item Deleted Successfully!',
          color: 'linear-gradient(135deg, #e74c3c, #c0392b)'
        };
      default:
        return {
          icon: '✅',
          message: 'Action Completed Successfully!',
          color: 'linear-gradient(135deg, #4CAF50, #45a049)'
        };
    }
  };

  return (
    <div className={"vault-layout"}>
      {/* Hamburger for mobile */}
      <button className="vault-hamburger" onClick={() => setSidebarOpen(true)}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="vault-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Success Animation */}
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
            <div 
              className="success-circle"
              style={{ background: getAnimationContent().color }}
            >
              <div className="success-icon-large">
                {getAnimationContent().icon}
              </div>
            </div>
            <div className="success-message">
              {getAnimationContent().message}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="vault-container">
        <div className="vault-wrapper">
          <div className="vault-header">
            <h1 className="vault-title">
              <FaLock className="icon" /> Vault
            </h1>
            <div className="vault-controls">
              <select onChange={(e) => setFilter(e.target.value)} value={filter} className="vault-select">
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat} className='stubborn-button'>{cat}</option>
                ))}
              </select>
              <button onClick={() => setIsAdding(true)} className='vault-btn all_buttons'>
                ➕ Add Item
              </button>
              <button onClick={handleAddCategory} className='vault-btn all_buttons'>
                📂 Add Category
              </button>
              <button onClick={toggleTheme} className="theme-toggle-icon" title="Toggle Theme">
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>

          {/* Add New Vault Item Form */}
          {isAdding && (
            <div className="vault-form-overlay">
              <div className="vault-form">
                <div className="vault-form-header">
                  <h2>Add New Vault Item</h2>
                  <button 
                    className="vault-form-close" 
                    onClick={() => setIsAdding(false)}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleAddNewItem} className="vault-form-content">
                  <div className="vault-form-group">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="vault-form-input"
                      required
                    />
                  </div>
                  <div className="vault-form-group">
                    <input
                      type="text"
                      placeholder="Username or Email"
                      value={newItem.username}
                      onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                      className="vault-form-input"
                      required
                    />
                  </div>
                  <div className="vault-form-group">
                    <input
                      type="text"
                      placeholder="Password"
                      value={newItem.password}
                      onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                      className="vault-form-input"
                      required
                    />
                  </div>
                  <div className="vault-form-group">
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="vault-form-select"
                    >
                      {categories.filter(cat => cat !== 'All').map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="vault-form-actions">
                    <button type="button" onClick={() => setIsAdding(false)} className="vault-btn vault-btn-cancel all_buttons">
                      Cancel
                    </button>
                    <button type="submit" className="vault-btn all_buttons">
                      💾 Save Item
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Vault Items Grid */}
          <div className="vault-grid">
            {filteredEntries.length === 0 ? (
              <div className="vault-empty-state">
                <FaLock className="vault-empty-icon" />
                <p className="vault-empty-message">No items in this category.</p>
                <button onClick={() => setIsAdding(true)} className="vault-btn all_buttons">
                  ➕ Add Your First Item
                </button>
              </div>
            ) : (
              filteredEntries.map((item, index) => (
                <div
                  key={index}
                  className={`vault-item theme-${index % 4}`}
                >
                  <div className="vault-item-header">
                    <h3 className="vault-item-name">{item.name}</h3>
                    <button 
                      className="vault-item-delete"
                      onClick={() => handleDeleteItem(entries.indexOf(item))}
                      title="Delete item"
                    >
                      ❌
                    </button>
                  </div>
                  <div className="vault-item-content">
                    <p className="vault-item-detail">👤 {item.username}</p>
                    <p className="vault-item-detail">🔑 {'*'.repeat(item.password.length)}</p>
                    <p className="vault-item-category">📁 {item.category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;