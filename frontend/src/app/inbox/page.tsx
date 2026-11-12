'use client';
import { RequireAuth } from '@/components';
const Inbox = () => {
  return (
    <RequireAuth notice="Log in to see your messages.">
      <h1>Inbox</h1>
    </RequireAuth>
  );
};

export default Inbox;
