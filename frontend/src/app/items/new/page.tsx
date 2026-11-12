'use client';
import { RequireAuth } from '@/components/RequireAuth';
const NewItems = () => {
  return (
    <RequireAuth notice="Please log in to sell an item.">
      <h1>New Items</h1>
    </RequireAuth>
  );
};

export default NewItems;
