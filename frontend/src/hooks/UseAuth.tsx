import { apiUrl } from '@/config';
import { useState, useEffect } from 'react';

const UseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchMe() {
      const response = await fetch(apiUrl('auth/me'));
      if (!response.ok) {
        if (response.status === 401) return;
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
      console.log('data', data);
    }
    try {
      fetchMe();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = null;
  const register = null;
  const logout = null;
  const refresh = null;
  return { user, loading, login, register, logout, refresh };
};

export default UseAuth;
