'use client';
import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import UseAuth from '@/hooks/UseAuth';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * The log in page.
 *
 * TODO: build the two-column layout from the prototype, with the form on
 * one side. Use the TextField and Button components once you have built them.
 */
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = UseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get('notice');
  return (
    <>
      {notice && <p>{notice}</p>}
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        onClick={async () => {
          console.log('Logging in with', email, password);
          try {
            await login(email, password);
            const next = searchParams.get('next') || '/';
            router.push(next);
          } catch (error) {
            console.error('Login failed:', error);
          }
        }}
      >
        Log in
      </Button>
    </>
  );
};
const Login = () => {
  return (
    <>
      <h1>Log in</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
};

export default Login;
