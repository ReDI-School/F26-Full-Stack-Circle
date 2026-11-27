import Link from 'next/link';
import { Suspense } from 'react';

import { Layout, Logo } from '../../components';
import LoginForm from './LoginForm';

const LoginPage = () => (
  <Layout variant="bare">
    <div className="fixed inset-0 grid grid-cols-1 overflow-y-auto min-[800px]:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-tertiary p-16 text-white min-[800px]:flex">
        <Link href="/" aria-label="ReDiCycle home" className="[&>span>span]:!text-white">
          <Logo size={36} />
        </Link>

        <div>
          <h1 className="max-w-[520px] font-display text-[52px] font-black leading-[1.1] tracking-[-1px] text-white">
            Give your stuff a second life.
          </h1>
          <p className="mt-5 max-w-[420px] text-[17px] text-[#bcd3db]">
            Buy and sell secondhand treasures with people near you. No fees, no middleman — you
            settle payment directly with the seller.
          </p>
        </div>

        <p className="font-mono text-[12px] text-[#8fb0bc]">Fullstack Circle · ReDi School</p>
      </aside>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  </Layout>
);

export default LoginPage;
