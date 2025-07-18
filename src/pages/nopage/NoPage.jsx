import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Wifi, WifiOff, AlertTriangle, Ghost, Zap, Sun, Moon } from 'lucide-react';
import './nopage.css';
import { useNavigate } from 'react-router-dom';

const NoPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate(); // ✅ Add this here

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? 'light' : 'dark';
  };

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  const handleGoHome = () => {
    navigate('/'); // ✅ navigate to Dashboard
  };

  const handleGoBack = () => {
    navigate(-1); // ✅ Go back
  };

  return (
    <div className="error-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="floating-icons">
        <div className="floating-icon"><Ghost size={48} /></div>
        <div className="floating-icon"><Zap size={40} /></div>
        <div className="floating-icon"><AlertTriangle size={44} /></div>
        <div className="floating-icon"><WifiOff size={42} /></div>
      </div>

      <div className="content">
        <div className="error-icon"><Ghost /></div>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Oops! The page you're looking for seems to have vanished into the digital void. 
          It might have been moved, deleted, or perhaps it never existed at all.
        </p>

        <div className="button-group">
          <button className="btn btn-primary" onClick={handleGoHome}>
            <Home size={20} />
            Go Home
          </button>
          <button className="btn btn-secondary" onClick={handleGoBack}>
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="connection-status">
          <Wifi size={16} className="wifi-icon" />
          <span>Connection Status: Active</span>
        </div>
      </div>
    </div>
  );
};

export default NoPage;
