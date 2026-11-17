'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { Avatar } from '../Avatar';
import { avatarMenuStyles } from './AvatarMenu.styles';
import type { AvatarMenuProps } from './AvatarMenu.types';

const AvatarMenu = ({ user, items }: AvatarMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    // Close when clicking anywhere outside the avatar
    const handleMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Close on Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Guest
  if (!user) return null;

  const styles = avatarMenuStyles();

  return (
    <div ref={rootRef} className={styles.root()}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger()}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Avatar name={user.name} src={user.avatarUrl} size="sm" />
      </button>

      {isOpen && (
        <div id={menuId} role="menu" className={styles.panel()}>
          {items.map((entry, index) =>
            entry.type === 'divider' ? (
              <div key={`divider-${index}`} role="separator" className={styles.divider()} />
            ) : (
              <button
                key={entry.label}
                type="button"
                role="menuitem"
                className={avatarMenuStyles({ danger: !!entry.danger }).item()}
                onClick={() => {
                  entry.onClick();
                  setIsOpen(false);
                }}
              >
                {entry.icon}
                {entry.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
