'use client';
import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import { useAuth } from '@/hooks';
import { pushNext } from '@/lib/navigation';
import { ApiError } from '@/config/api';
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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
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
        type="button"
        disabled={submitting}
        onClick={async () => {
          setError(null);
          setSubmitting(true);
          try {
            await login(email, password);
            pushNext(router, searchParams);
          } catch (error) {
            setError(
              error instanceof ApiError ? error.message : 'Unable to log in. Please try again.'
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        Log in
      </Button>
      {error && (
        <p role="alert" className="text-danger-text">
          {error}
        </p>
      )}
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
