import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import api from '../api';
import BackendContext from '../contexts/BackendContext';

const BackendWaker = ({ children }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let interval;
    let timeout;
    const startTime = Date.now();
    const MAX_WAIT_TIME = 60000; // 60 seconds max

    const pingBackend = async () => {
      try {
        const response = await api.get('health', { timeout: 8000 });
        if (response.status === 200) {
          console.log('✅ Backend connected successfully!');
          setIsAwake(true);
          clearInterval(interval);
          clearTimeout(timeout);
        }
      } catch (error) {
        const elapsed = Date.now() - startTime;
        console.log(`⏱️ Backend check failed (${Math.floor(elapsed / 1000)}s):`, error.message);
        
        // If we've waited more than 60 seconds, show the page anyway
        if (elapsed > MAX_WAIT_TIME) {
          console.warn('⚠️ Timeout reached. Showing page anyway.');
          setIsAwake(true);
          clearInterval(interval);
          return;
        }
        
        // Update loading time for the UI
        setLoadingTime(Math.floor(elapsed / 1000));
        
        // Retry after 3 seconds
        setTimeout(pingBackend, 3000);
      }
    };

    pingBackend();

    // Update timer every second
    interval = setInterval(() => {
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Safety timeout - force show after 70 seconds
    timeout = setTimeout(() => {
      console.warn('🔴 Backend health check timeout - forcing page load');
      setIsAwake(true);
    }, 70000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
                {loadingTime > 60 ? '⚠️ Loading anyway...' : 'Input fields will be enabled once connected'}
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
