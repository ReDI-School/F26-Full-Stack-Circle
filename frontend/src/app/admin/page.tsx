'use client';
import { RequireAuth } from '@/components/RequireAuth';
const Admin = () => {
  return (
    <RequireAuth needAdminRights={true}>
      <h1>Admin</h1>
    </RequireAuth>
  );
};

export default Admin;
