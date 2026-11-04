'use client';
import { RequireAuth } from '@/components/RequireAuth';
const Admin = () => {
  return (
    <RequireAuth needAdminRights={true} notice="You must be an administrator to access this page.">
      <h1>Admin</h1>
    </RequireAuth>
  );
};

export default Admin;
