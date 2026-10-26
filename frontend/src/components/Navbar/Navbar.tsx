'use client';

import type { KeyboardEvent } from 'react';

import { AvatarMenu } from '../AvatarMenu';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { navbarStyles } from './Navbar.styles';
import type { NavbarProps } from './Navbar.types';

/** Phosphor "Chat" (regular), 20px. */
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M216,48H40A16,16,0,0,0,24,64V224a15.84,15.84,0,0,0,9.25,14.5A16.05,16.05,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216Z" />
  </svg>
);

/** Keeps the badge small: anything above 99 becomes "99+". */
const formatUnread = (count: number) => (count > 99 ? '99+' : String(count));

const Navbar = ({
  user,
  unreadCount = 0,
  searchValue,
  onSearchChange,
  onSearch,
  onLogoClick,
  onAddItem,
  onInbox,
  onLogin,
  onRegister,
  menuItems = [],
}: NavbarProps) => {
  const styles = navbarStyles();
  const hasUnread = unreadCount > 0;

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // isComposing: don't search while an IME (e.g. Japanese input) is still composing
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      onSearch?.(event.currentTarget.value);
    }
  };

  return (
    <nav className={styles.root()} aria-label="Main">
      <div className={styles.inner()}>
        {/* The Logo's SVG has aria-label="ReDiCycle", which names this button */}
        <button type="button" className={styles.logoButton()} onClick={onLogoClick}>
          <Logo size={28} />
        </button>

        <input
          type="search"
          className={styles.search()}
          placeholder="Search all items…"
          aria-label="Search all items"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          onKeyDown={handleSearchKeyDown}
        />

        <div className={styles.actions()}>
          {user ? (
            <>
              <Button type="button" variant="primary" size="sm" onClick={onAddItem}>
                + Add item
              </Button>

              <button
                type="button"
                className={styles.inbox()}
                onClick={onInbox}
                aria-label={hasUnread ? `Inbox, ${unreadCount} unread` : 'Inbox'}
              >
                <ChatIcon />
                {hasUnread ? (
                  <span className={styles.badge()} aria-hidden="true">
                    {formatUnread(unreadCount)}
                  </span>
                ) : null}
              </button>

              <AvatarMenu user={user} items={menuItems} />
            </>
          ) : (
            <>
              <Button type="button" variant="ghost" size="sm" onClick={onLogin}>
                Log in
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={onRegister}>
                Start selling
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
