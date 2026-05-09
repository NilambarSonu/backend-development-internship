import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import api from '../api';

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

  if (!isAwake) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-3 border-gray-200"></div>
          <div 
            className="absolute inset-0 rounded-full border-3 border-blue-500 border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Connecting to backend
          </h2>
          <p className="text-xs text-gray-500">
            {loadingTime > 30 ? 'Taking longer than expected...' : `${loadingTime}s`}
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default BackendWaker;
