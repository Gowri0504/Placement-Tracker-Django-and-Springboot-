import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const data = JSON.parse(userInfo);
          
          // Set user from local storage first for immediate UI feedback
          setUser(data.user || data);
          
          // Refresh user data from backend in background
          try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            localStorage.setItem('userInfo', JSON.stringify({ ...data, user: response.data }));
          } catch (e) {
            console.error("Session verification failed", e);
            // If it's a 401/403, axios interceptor will handle redirect
          }
        }
      } catch (error) {
        console.error('Error parsing user info from localStorage', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const signup = async (fullName, email, password, role = 'STUDENT', college = '', skills = []) => {
    try {
      const { data } = await api.post('/auth/register', { fullName, email, password, role, college, skills });
      setUser(data.user);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
