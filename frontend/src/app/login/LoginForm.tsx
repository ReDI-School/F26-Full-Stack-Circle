'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, TextField } from '../../components';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get('notice');
  const requestedNext = searchParams.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Wrong email or password.');
          return;
        }

        const payload: unknown = await response.json().catch(() => null);
        const message =
          typeof payload === 'object' &&
          payload !== null &&
          'error' in payload &&
          typeof payload.error === 'string'
            ? payload.error
            : 'Unable to log in. Please try again.';
        setError(message);
        return;
      }

      const destination =
        requestedNext?.startsWith('/') &&
        !requestedNext.startsWith('//') &&
        !requestedNext.startsWith('/\\')
          ? requestedNext
          : '/';
      router.replace(destination);
    } catch {
      setError('Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center p-8 sm:p-16">
      <form className="flex w-full max-w-[380px] flex-col gap-[18px]" onSubmit={handleSubmit}>
        <h1 className="font-display text-[32px] font-black">Welcome back!</h1>

        {notice ? (
          <p className="rounded-input bg-primary-100 p-3 text-[13px] text-[#2e7d96]">{notice}</p>
        ) : null}

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@redi-school.org"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error ? (
          <p role="alert" className="text-[13px] font-medium text-secondary">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="primary" stretch disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>

        <p className="text-body">
          New here?{' '}
          <Link className="font-bold text-primary" href="/register">
            Create an account
          </Link>
          {' — '}you get your own shop instantly.
        </p>

        <Link className="text-body text-placeholder" href="/">
          ← keep browsing without an account
        </Link>
      </form>
    </section>
  );
};

export default LoginForm;
