'use client';
import { RequireAuth } from '@/components/RequireAuth';
const Register = () => {
  return (
    <RequireAuth notice="Please log in to view your account information.">
      <h1>Account</h1>
    </RequireAuth>
  );
};

export default Register;
