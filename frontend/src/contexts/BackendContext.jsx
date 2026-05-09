import { createContext, useContext } from 'react';

const BackendContext = createContext();

export const useBackendStatus = () => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error('useBackendStatus must be used within BackendWaker');
  }
  return context;
};

export default BackendContext;
