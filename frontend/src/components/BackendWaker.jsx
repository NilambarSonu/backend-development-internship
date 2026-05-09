import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import api from '../api';
import BackendContext from '../contexts/BackendContext';

const BackendWaker = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let interval;
    const startTime = Date.now();

    const pingBackend = async () => {
      try {
        const response = await api.get('/health', { timeout: 5000 });
        if (response.status === 200) {
          setIsAwake(true);
        }
      } catch (error) {
        console.log("Backend is still waking up...", error.message);
        // Update loading time for the UI
        setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
        setTimeout(pingBackend, 3000);
      }
    };

    pingBackend();

    // Just for a smooth timer feel
    interval = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BackendContext.Provider value={{ isAwake, loadingTime }}>
      <div className="relative">
        {/* Show banner when backend is waking up */}
        {!isAwake && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b-2 border-yellow-400 px-4 py-3 z-40 flex items-center justify-center gap-3 shadow-sm">
            <div className="relative w-5 h-5 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-yellow-300"></div>
              <div 
                className="absolute inset-0 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"
                style={{ animationDuration: '1.5s' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-3 h-3 text-yellow-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-yellow-800">
                Connecting to backend... {loadingTime}s
              </span>
              <span className="text-xs text-yellow-700">
                Input fields will be enabled once connected
              </span>
            </div>
          </div>
        )}
        
        {/* Add top padding to content when banner is showing */}
        <div className={!isAwake ? 'pt-20' : ''}>
          {children}
        </div>
      </div>
    </BackendContext.Provider>
  );
};

export default BackendWaker;
