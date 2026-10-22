import type { ReactNode } from 'react';

interface AvatarMenuUser {
  name: string;
  avatarUrl?: string;
}

interface AvatarMenuAction {
  type?: 'item';
  label: string;
  icon?: ReactNode;

  onClick: () => void;
  danger?: boolean;
}

interface AvatarMenuDivider {
  type: 'divider';
}

type AvatarMenuEntry = AvatarMenuAction | AvatarMenuDivider;

interface AvatarMenuProps {
  user?: AvatarMenuUser;
  items: AvatarMenuEntry[];
}

export type {
  AvatarMenuProps,
  AvatarMenuEntry,
  AvatarMenuAction,
  AvatarMenuDivider,
  AvatarMenuUser,
};
