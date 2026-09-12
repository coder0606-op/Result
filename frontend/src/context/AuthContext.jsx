import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from sessionStorage (cleared automatically on tab/browser close)
    const storedUser = sessionStorage.getItem('user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse cached user session');
        logout();
      }
    } else {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', authToken);
  };

  const register = (registerData) => {
    const newUser = {
      name: registerData.name,
      email: registerData.email,
      schoolName: registerData.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR',
      role: 'ADMIN'
    };
    const newToken = 'jwt-token-' + Date.now();
    login(newUser, newToken);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
