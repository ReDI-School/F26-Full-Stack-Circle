'use client';
import { Footer, Layout, Navbar } from '@/components';
import { useAuth } from '@/hooks';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return (
    <Layout
      navbar={<Navbar user={user} />}
      footer={<Footer categoryLinks={[]} infoLinks={[]} accountLinks={[]} />}
    >
      {children}
    </Layout>
  );
};

export default AppShell;
