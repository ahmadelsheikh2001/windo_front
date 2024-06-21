/* eslint-disable react/prop-types */

// src/context/Context.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get('https://api.wintecpvc.com/api/v1/User/getAdminDetails', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: false
          });
          setIsAuthenticated(true);
          setRole(res.data.role);
        } catch (error) {
          setIsAuthenticated(false);
          setRole('');
        }
      };
      fetchUser();
    }
  }, []);

  return (
    <Context.Provider value={{ isAuthenticated, setIsAuthenticated, role }}>
      {children}
    </Context.Provider>
  );
};

