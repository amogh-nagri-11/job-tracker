import { useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};