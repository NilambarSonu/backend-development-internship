import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useBackendStatus } from '../contexts/BackendContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAwake } = useBackendStatus();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      background: '#050505', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative', 
      overflow: 'hidden', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' 
    }}>
      
      {/* Background Starfield */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.1, pointerEvents: 'none' }} />

      {/* Large Purple Planet */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '-15%',
        transform: 'translateY(-50%)',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 0% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(186, 104, 255, 0.6) 5%, rgba(103, 58, 183, 0.4) 15%, rgba(33, 15, 65, 0.9) 40%, #050505 80%)',
        boxShadow: '-50px 0 100px rgba(103, 58, 183, 0.3)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Auth Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <img src="/favicon.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>Task Management</h1>
        </div>
        <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '500', marginBottom: '8px', letterSpacing: '-0.02em' }}>Join Now</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '32px' }}>Start your journey with Task Management today</p>

        {error && (
          <div style={{ marginBottom: '20px', color: '#ff453a', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isAwake}
            required
            style={{
              width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', opacity: !isAwake ? 0.5 : 1, cursor: !isAwake ? 'not-allowed' : 'text'
            }}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isAwake}
            required
            style={{
              width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', opacity: !isAwake ? 0.5 : 1, cursor: !isAwake ? 'not-allowed' : 'text'
            }}
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isAwake}
              required
              minLength={6}
              style={{
                width: '100%', padding: '16px 60px 16px 16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', opacity: !isAwake ? 0.5 : 1, cursor: !isAwake ? 'not-allowed' : 'text'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!isAwake}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: !isAwake ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '500', opacity: !isAwake ? 0.5 : 1 }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !isAwake}
            style={{
              width: '100%', padding: '14px', background: 'linear-gradient(90deg, #7c3aed, #9333ea)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: (loading || !isAwake) ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', marginTop: '12px', opacity: (loading || !isAwake) ? 0.6 : 1
            }}
          >
            {!isAwake ? 'Waiting for server...' : loading ? 'Creating Account...' : 'Join Now'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', position: 'relative', zIndex: 10 }}>
        Already have an account? <Link to="/login" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
