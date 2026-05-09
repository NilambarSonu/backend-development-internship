import { useState, useEffect } from 'react';
import api from '../api';

const BackendWaker = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let interval;
    const startTime = Date.now();

    const pingBackend = async () => {
      try {
        await api.get('/health');
        setIsAwake(true);
      } catch {
        console.log("Backend is still waking up...");
        // Update loading time for the UI
        setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
        setTimeout(pingBackend, 2000);
      }
    };

    pingBackend();

    // Just for a smooth timer feel
    interval = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isAwake) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-[#fafafa] p-6 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-500">{loadingTime}s</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Waking up the server
        </h1>
        
        <p className="text-zinc-400 max-w-md mb-8 italic">
          Render's free tier is stretching its legs. We're brewing some coffee for the backend, hang tight!
        </p>

        <div className="space-y-4 w-full max-w-xs">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${Math.min((loadingTime / 50) * 100, 95)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Standby</span>
            <span>{loadingTime > 30 ? 'Almost there...' : 'Initiating...'}</span>
          </div>
        </div>

        <div className="mt-12 text-zinc-600 text-sm">
          {loadingTime > 40 && (
            <p className="animate-pulse">This usually takes about 50 seconds after long inactivity.</p>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default BackendWaker;
