// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = null; // Replace with actual logic
      setUser(storedUser);
      setLoading(false);
    };

    // checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData); // Set the user data after successful login
  };

  const logout = () => {
    setUser(null); // Clear the user data on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};