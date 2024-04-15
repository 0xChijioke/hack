import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { checkAddress } from '~~/utils/check-address';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthentication: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  checkAuthentication: () => Promise.resolve(),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const { address: connectedAddress, isDisconnected } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthentication = async () => {
    setIsLoading(true);
    try {
      if (!connectedAddress || isDisconnected) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }
      router.prefetch("/register");
      
      const userData = await checkAddress({ address: connectedAddress });
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);

      router.push(`/dashboard/${userData.id}`);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push('/register');
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, [connectedAddress, isDisconnected]);



  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
