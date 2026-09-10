import type { Metadata } from 'next';

import '../assets/css/reset.css';
import '../assets/css/global.css';

import { Layout } from '../components';

export const metadata: Metadata = {
  title: "ReDiCycle — someone's old, your new",
  description:
    'A secondhand store built by the ReDi School Fullstack Circle. Buyers and sellers settle payment directly — like a flea market, but online.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;
