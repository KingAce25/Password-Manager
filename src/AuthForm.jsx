import React, { useState } from 'react';

function AuthForm({ onSignup, onLogin }) {
  const [mode, setMode] = useState('login'); // or 'signup'
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      alert('Please fill all fields');
      return;
    }

    const success = mode === 'login' ? onLogin(form) : onSignup(form);

    if (success) {
      setForm({ username: '', password: '' });
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '8px' }}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </span>
      </p>
    </div>
  );
}

export default AuthForm;
