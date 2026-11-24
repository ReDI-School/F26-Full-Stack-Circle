'use client';

import { navbarStyles } from './Navbar.styles';
import { Logo } from '../Logo';

/**
 * Navbar with real logo and search field, plus a skeleton for the actions area
 * (the part that depends on auth). This shows the known parts immediately and
 * only pulses the unknown right-side buttons/avatar, eliminating layout shift.
 *
 * This is NOT a variant of Navbar; it's a separate loading‑state component
 * that matches Navbar's visual appearance but can't be a drop‑in replacement
 * (Navbar needs `user`, callbacks, etc.). Used only in AppShell while /me is loading.
 */
const NavbarLoading = () => {
  const styles = navbarStyles();
  return (
    <nav className={styles.root()} aria-label="Main" aria-busy="true">
      <div className={styles.inner()}>
        {/* Logo is always there */}
        <button type="button" className={styles.logoButton()} disabled>
          <span className={styles.logoFull()}>
            <Logo size={28} />
          </span>
          <span className={styles.logoMark()}>
            <Logo size={28} withWordmark={false} />
          </span>
        </button>

        {/* Search field is always there */}
        <form role="search" className={styles.searchForm()}>
          <input
            type="search"
            name="q"
            enterKeyHint="search"
            className={styles.search()}
            placeholder="Search all items…"
            aria-label="Search all items"
            disabled
          />
        </form>

        {/* Actions area skeleton - one pill covering the space where buttons/avatar will appear */}
        <div role="status" aria-label="Loading navigation actions" className={styles.actions()}>
          <span className="sr-only">Loading navigation…</span>
          <div
            aria-hidden="true"
            className="h-10 w-48 rounded-pill bg-border motion-safe:animate-pulse"
          />
        </div>
      </div>
    </nav>
  );
};

export default NavbarLoading;
