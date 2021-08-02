import { createContext, useContext } from 'react';
import useProvideAuth from '../hooks/useProvideAuth';

const authContext = createContext();

// eslint-disable-next-line
export default function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}
