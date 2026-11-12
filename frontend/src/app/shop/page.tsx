'use client';
import { RequireAuth } from '@/components';
const Shop = () => {
  return (
    <RequireAuth notice="Please log in to view your shop information.">
      <h1>Shop</h1>
    </RequireAuth>
  );
};

export default Shop;
