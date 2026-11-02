'use client';
import { RequireAuth } from '@/components/RequireAuth';
const Inbox = () => {
  return (
    <RequireAuth notice="Please log in to view your inbox.">
      <h1>Inbox</h1>
    </RequireAuth>
  );
};

export default Inbox;
