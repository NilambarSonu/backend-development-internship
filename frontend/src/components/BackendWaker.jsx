import { useState, useEffect } from 'react';
import { Clock, Server, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import BackendContext from '../contexts/BackendContext';

const BackendWaker = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [status, setStatus] = useState('connecting'); // connecting, success, timeout

  useEffect(() => {
    let interval;
    let timeout;
    const startTime = Date.now();
    const MAX_WAIT_TIME = 60000; // 60 seconds max
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const healthUrl = `${apiUrl}/health`;
    
    console.log('🔍 Attempting to connect to:', healthUrl);

    const pingBackend = async () => {
      try {
        const response = await axios.get(healthUrl, { timeout: 8000 });
        if (response.status === 200) {
          console.log('✅ Backend connected successfully!');
          setStatus('success');
          // Small delay for the success state to be visible
          setTimeout(() => {
            setIsAwake(true);
          }, 800);
          clearInterval(interval);
          clearTimeout(timeout);
        }
      } catch (error) {
        const elapsed = Date.now() - startTime;
        console.log(`⏱️ Backend check failed (${Math.floor(elapsed / 1000)}s):`, error.message);
        
        if (elapsed > MAX_WAIT_TIME) {
          console.warn('⚠️ Timeout reached. Showing page anyway.');
          setStatus('timeout');
          setTimeout(() => {
            setIsAwake(true);
          }, 1000);
          clearInterval(interval);
          return;
        }
        
        setLoadingTime(Math.floor(elapsed / 1000));
        setTimeout(pingBackend, 3000);
      }
    };

    pingBackend();

    interval = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    timeout = setTimeout(() => {
      console.warn('🔴 Backend health check timeout - forcing page load');
      setStatus('timeout');
      setIsAwake(true);
    }, 70000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (isAwake) return (
    <BackendContext.Provider value={{ isAwake, loadingTime }}>
      {children}
    </BackendContext.Provider>
  );

  return (
    <BackendContext.Provider value={{ isAwake, loadingTime }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#09090b] selection:bg-indigo-500/30">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative w-full max-w-md px-6">
          <div className="bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent"></div>
            
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icon Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                <div className="relative bg-zinc-800/80 border border-zinc-700/50 p-5 rounded-2xl shadow-inner">
                  {status === 'success' ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-in zoom-in duration-300" />
                  ) : status === 'timeout' ? (
                    <Server className="w-10 h-10 text-amber-400" />
                  ) : (
                    <div className="relative">
                      <Clock className="w-10 h-10 text-indigo-400 animate-pulse" />
                      <Loader2 className="absolute -top-1 -right-1 w-4 h-4 text-indigo-500 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                  {status === 'success' ? 'Connected' : 'Waking up Backend'}
                </h2>
                <p className="text-zinc-400 text-sm max-w-[240px] mx-auto leading-relaxed">
                  {status === 'success' 
                    ? 'Everything is ready. Redirecting...' 
                    : 'Render instance is spinning up. This usually takes 30-60 seconds.'}
                </p>
              </div>

              {/* Progress Bar Area */}
              <div className="w-full space-y-4 pt-2">
                <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                      status === 'success' ? 'bg-emerald-500 w-full' : 'bg-indigo-500'
                    }`}
                    style={{ 
                      width: status === 'success' ? '100%' : `${Math.min((loadingTime / 60) * 100, 95)}%` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                  <span className={status === 'success' ? 'text-emerald-500/70' : 'text-zinc-500'}>
                    {status === 'success' ? 'Live' : 'Spinning up'}
                  </span>
                  <span className="text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded-md tabular-nums">
                    {loadingTime}s
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Text */}
          <p className="mt-6 text-center text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
            Primetrade.ai Infrastructure
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}} />
    </BackendContext.Provider>
  );
};

export default BackendWaker;

