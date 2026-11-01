'use client';
import { Navbar } from '@/components';
import { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { apiUrl } from '@/config';

const AppShell = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchMe() {
      const response = await fetch(apiUrl('auth/me'), {
        credentials: 'include',
      });
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

  return (
    <AuthContext value={{ user, loading }}>
      <Navbar user={user} />
    </AuthContext>
  );
};

export default AppShell;
