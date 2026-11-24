import Link from 'next/link';

const ItemNotFound = () => (
  <main className="mx-auto flex min-h-[50vh] w-full max-w-[1076px] flex-col items-center justify-center px-8 py-16 text-center">
    <p className="text-caption font-bold uppercase tracking-wider text-muted">
      404 · Item not found
    </p>
    <h1 className="mt-3 font-display text-3xl font-black text-ink">This item is no longer here.</h1>
    <p className="mt-2 max-w-md text-body text-muted">
      It may have been removed, or the link may be incorrect.
    </p>
    <Link
      href="/"
      className="mt-6 rounded-pill bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
    >
      ← Back to browse
    </Link>
  </main>
);

export default ItemNotFound;
