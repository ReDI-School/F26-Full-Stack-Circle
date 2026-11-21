'use client';
import { RequireAuth } from '@/components';
import Inbox from './Inbox';

const InboxPage = () => {
  return (
    <RequireAuth notice="Log in to see your messages.">
      <Inbox />
    </RequireAuth>
  );
};

export default InboxPage;
