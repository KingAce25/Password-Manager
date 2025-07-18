import React, { useState, useEffect } from 'react';
import { UserProfile } from '@clerk/clerk-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { FaBars, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import './editProfile.css'; // Create this CSS file or reuse your global/dashboard CSS

const EditProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSuccess = () => {
    toast.success('✅ Profile updated successfully!');
  };

  const handleError = (err) => {
    toast.error('❌ Failed to update profile');
    console.error(err);
  };

  return (
    <div className="dashboard-wrapper">
      {/* 🍔 Mobile Hamburger */}
      <button className="hamburger" onClick={() => setSidebarOpen(true)}>
        <FaBars />
      </button>

      {/* 🧭 Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 📢 Toasts */}
      <Toaster position="top-right" />

      {/* 📦 Main Content */}
      {/* <motion.div
        className="dashboard-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      > */}
        <div className="header-wrapper">
          {/* <button
            onClick={() => navigate('/settings')}
            className="back-btn"
          >
            <FaArrowLeft /> Back
          </button> */}

          <div className="breadcrumb">
            <span onClick={() => navigate('/settings')}>Settings</span> <FaChevronRight /> <span onClick={() => navigate('/edit-profile')}>Edit Profile</span>
          </div>
        </div>

        <div className="profile-form-wrapper">
          <UserProfile
            path="/edit-profile"
            routing="path"
            appearance={{
              elements: {
                card: {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                },
                rootBox: {
                  width: '100%',
                },
              },
              variables: {
                colorPrimary: '#f97316',
                borderRadius: '8px',
                fontFamily: 'Segoe UI, sans-serif',
              },
            }}
            afterSubmit={handleSuccess}
            onError={handleError}
          />
        </div>
      {/* </motion.div> */}
    </div>
  );
};

export default EditProfile;
