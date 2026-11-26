'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { ApiError } from '../../config/api';
import { Button, TextField } from '../../components';
import { useAuth } from '../../hooks';
import { pushNext } from '../../lib/navigation';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const notice = searchParams.get('notice');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(normalizedEmail, password);
      pushNext(router, searchParams);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError('Wrong email or password.');
        } else {
          setError(error.message || 'Unable to log in. Please try again.');
        }
      } else {
        setError('Unable to log in. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen w-full items-center justify-center p-8 sm:p-16">
      <form className="flex w-full max-w-[380px] flex-col gap-[18px]" onSubmit={handleSubmit}>
        <h1 className="font-display text-[32px] font-black">Welcome back!</h1>

        {notice ? (
          <p className="rounded-input bg-primary-100 p-3 text-[13px] text-primary-700">{notice}</p>
        ) : null}

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@redi-school.org"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError('');
          }}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError('');
          }}
        />

        {error ? (
          <p role="alert" aria-live="assertive" className="text-[13px] font-medium text-secondary">
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
