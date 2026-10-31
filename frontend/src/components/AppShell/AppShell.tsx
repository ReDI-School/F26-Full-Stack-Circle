'use client';
import { Navbar } from '@/components';
import { useAuth } from '@/hooks';

const AppShell = () => {
  const { user, loading, login, register, logout, refresh } = useAuth();
  return (
    <>
      <Navbar />
    </>
  );
};

export default AppShell;
