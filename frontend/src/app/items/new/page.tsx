'use client';
import { RequireAuth } from '@/components';
import AddItemForm from './AddItemForm';

const NewItem = () => {
  return (
    <RequireAuth notice="Please log in to sell an item.">
      <div className="py-10">
        <h1 className="mb-6">List a new item 📦</h1>
        <AddItemForm />
      </div>
    </RequireAuth>
  );
};

export default NewItem;
