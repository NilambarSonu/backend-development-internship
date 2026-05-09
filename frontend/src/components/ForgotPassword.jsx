import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useBackendStatus } from '../contexts/BackendContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAwake } = useBackendStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage('Instructions sent! Check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
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
        textAlign: message ? 'center' : 'left'
      }}>
        
        {!message ? (
          <>
            <h2 style={{ color: '#ffffff', fontSize: '32px', fontWeight: '500', marginBottom: '8px', letterSpacing: '-0.02em' }}>Reset</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '32px' }}>Enter your email to receive instructions</p>

            {error && (
              <div style={{ marginBottom: '20px', color: '#ff453a', fontSize: '13px', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

              <button
                type="submit"
                disabled={loading || !isAwake}
                style={{
                  width: '100%', padding: '14px', background: 'linear-gradient(90deg, #7c3aed, #9333ea)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: (loading || !isAwake) ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', marginTop: '12px', opacity: (loading || !isAwake) ? 0.6 : 1
                }}
              >
                {!isAwake ? 'Waiting for server...' : loading ? 'Sending...' : 'Send Link'}
              </button>
            </form>
          </>
        ) : (
          <div>
            <div style={{ width: '48px', height: '48px', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Check Email</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '15px', lineHeight: '1.5', marginBottom: '32px' }}>
              Instructions have been sent to <br/><strong style={{ color: '#fff' }}>{email}</strong>
            </p>
            <button
              onClick={() => setMessage('')}
              style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        )}

        <p style={{ marginTop: '32px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: '14px' }}>
          Back to <Link to="/login" style={{ color: '#9333ea', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
