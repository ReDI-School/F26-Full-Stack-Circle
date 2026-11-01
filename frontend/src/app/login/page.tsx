'use client';
import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import UseAuth from '@/hooks/UseAuth';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
/**
 * The log in page.
 *
 * TODO: build the two-column layout from the prototype, with the form on
 * one side. Use the TextField and Button components once you have built them.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout } = UseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <>
      <h1>Log in</h1>
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

      <Button
        onClick={() => {
          console.log('Logging out');
          logout();
        }}
      >
        Log out
      </Button>
    </>
  );
};

export default Login;
