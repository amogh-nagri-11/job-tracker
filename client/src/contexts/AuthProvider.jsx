import { useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const restoreUser = async () => { 
      try { 
        const { data } = await api.get('/api/auth/me') 
        setUser(data); 
      } catch {
          setUser(null);
      } finally {
        setLoading(false);
      }
    }; 
    restoreUser();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};