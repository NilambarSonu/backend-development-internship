import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useBackendStatus } from '../contexts/BackendContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAwake } = useBackendStatus();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '150px 150px', backgroundPosition: '50px 50px', opacity: 0.05, pointerEvents: 'none' }} />

      {/* Large Purple Planet from Image */}
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
      }}>
        {/* Glow effect on the edge of the planet */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '-5%',
          width: '100%',
          height: '80%',
          background: 'radial-gradient(ellipse at 0% 50%, rgba(255, 100, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 2
        }} />
      </div>

      {/* Auth Card - Glassmorphism */}
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
        <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '500', marginBottom: '8px', letterSpacing: '-0.02em' }}>Sign In</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '32px' }}>Keep it all together and you'll be fine</p>

        {error && (
          <div style={{ marginBottom: '20px', color: '#ff453a', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isAwake}
              required
              style={{
                width: '100%', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', opacity: !isAwake ? 0.5 : 1, cursor: !isAwake ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isAwake}
              required
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

          <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '4px 0 12px' }}>
            <Link to="/forgot-password" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', textDecoration: 'none' }}>Forgot Password</Link>
          </div>

          <button
            type="submit"
            disabled={loading || !isAwake}
            style={{
              width: '100%', padding: '14px', background: 'linear-gradient(90deg, #7c3aed, #9333ea)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: (loading || !isAwake) ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', opacity: (loading || !isAwake) ? 0.6 : 1
            }}
          >
            {!isAwake ? 'Waiting for server...' : loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', position: 'relative', zIndex: 10 }}>
        New to TaskFlow <Link to="/register" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>Join Now</Link>
      </p>
    </div>
  );
};

export default Login;
