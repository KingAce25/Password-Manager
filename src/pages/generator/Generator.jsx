import React, { useState, useCallback, useContext } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import { FaBars, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import './generator.css';

const PasswordGenerator = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'il1Lo0O',
    ambiguous: '{}[]()/\\\'"`~,;.<>'
  };

  // Generate secure random password
  const generatePassword = useCallback(() => {
    let charset = '';
    
    // Build character set based on options
    if (options.uppercase) charset += charSets.uppercase;
    if (options.lowercase) charset += charSets.lowercase;
    if (options.numbers) charset += charSets.numbers;
    if (options.symbols) charset += charSets.symbols;
    
    // Remove similar/ambiguous characters if requested
    if (options.excludeSimilar) {
      charset = charset.split('').filter(char => !charSets.similar.includes(char)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(char => !charSets.ambiguous.includes(char)).join('');
    }
    
    if (charset.length === 0) {
      setPassword('Please select at least one character type');
      return;
    }
    
    // Generate password ensuring at least one character from each selected type
    let newPassword = '';
    let requiredChars = '';
    
    // Add one character from each selected type
    if (options.uppercase) requiredChars += charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)];
    if (options.lowercase) requiredChars += charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)];
    if (options.numbers) requiredChars += charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)];
    if (options.symbols) requiredChars += charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)];
    
    // Fill remaining length with random characters
    for (let i = requiredChars.length; i < length; i++) {
      newPassword += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password to mix required characters
    const shuffled = (requiredChars + newPassword).split('').sort(() => Math.random() - 0.5).join('');
    setPassword(shuffled);
  }, [length, options]);

  // Copy password to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (!password || password.length < 8) return { score: 0, text: 'Very Weak', className: 'very-weak' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { score: score * 16.67, text: 'Weak', className: 'weak' };
    if (score <= 4) return { score: score * 16.67, text: 'Fair', className: 'fair' };
    if (score <= 5) return { score: score * 16.67, text: 'Good', className: 'good' };
    return { score: 100, text: 'Strong', className: 'strong' };
  };

  const strength = getPasswordStrength();

  // Generate initial password
  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="dashboard-wrapper {`generator-wrapper ${darkMode}`}">
        {/*Mobile hamburger*/}
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <FaBars />
        </button>
        {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="password-generator">
      <div className="password-generator__header">
        <div className="p_header-button">
            <h2 className="password-generator__title">Password Generator</h2>
            <button onClick={toggleTheme} className="theme-toggle-icon" title="Toggle Theme">
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
        </div>
        <p className="password-generator__subtitle">Generate secure passwords for your accounts</p>
      </div>

      {/* Generated Password Display */}
      <div className="password-generator__section">
        <div className="password-generator__password-container">
          <div className="password-generator__password-display">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className="password-generator__password-input"
              placeholder="Generated password will appear here"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="password-generator__icon-button"
              title="Toggle password visibility"
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
            <button
              onClick={copyToClipboard}
              className="password-generator__icon-button"
              title="Copy password"
            >
              {copied ? '✅' : '📋'}
            </button>
          </div>
        </div>

        {/* Password Strength Indicator */}
        <div className="password-generator__strength-container">
          <div className="password-generator__strength-header">
            <span className="password-generator__strength-label">Password Strength</span>
            <span className="password-generator__strength-text">{strength.text}</span>
          </div>
          <div className="password-generator__strength-bar">
            <div 
              className={`password-generator__strength-fill password-generator__strength-fill--${strength.className}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Length Slider */}
      <div className="password-generator__section">
        <label className="password-generator__label">
          Password Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="password-generator__slider"
        />
        <div className="password-generator__slider-labels">
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Character Type Options */}
      <div className="password-generator__section">
        <h3 className="password-generator__options-title">Include Characters</h3>
        <div>
          {[
            { key: 'uppercase', label: 'Uppercase Letters (A-Z)' },
            { key: 'lowercase', label: 'Lowercase Letters (a-z)' },
            { key: 'numbers', label: 'Numbers (0-9)' },
            { key: 'symbols', label: 'Symbols (!@#$%^&*)' }
          ].map(({ key, label }) => (
            <div key={key} className="password-generator__checkbox-container">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                className="password-generator__checkbox"
              />
              <span className="password-generator__checkbox-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="password-generator__section">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="password-generator__advanced-toggle"
        >
          ⚙️ Advanced Options
        </button>
        
        {showAdvanced && (
          <div className="password-generator__advanced-options">
            <div className="password-generator__checkbox-container">
              <input
                type="checkbox"
                checked={options.excludeSimilar}
                onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                className="password-generator__checkbox"
              />
              <span className="password-generator__checkbox-label">
                Exclude similar characters (i, l, 1, L, o, 0, O)
              </span>
            </div>
            <div className="password-generator__checkbox-container">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => setOptions(prev => ({ ...prev, excludeAmbiguous: e.target.checked }))}
                className="password-generator__checkbox"
              />
              <span className="password-generator__checkbox-label">
                Exclude ambiguous characters ({`{} [] () /\\ ' " \` ~`})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="password-generator__generate-button"
      >
        🔄 Generate New Password
      </button>

      {/* Copy Success Message */}
      {copied && (
        <div className="password-generator__success-message">
          Password copied to clipboard!
        </div>
      )}
      </div>
    </div>
  );
};

export default PasswordGenerator;