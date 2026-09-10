interface NavbarProps {
  /**
   * The name of the signed-in user
   */
  userName: string;

  // TODO: add the rest of the props this component needs:
  // - guest state when there is no user (Log in / Start selling)
  // - search box
  // - unreadCount on the inbox bubble
  // - onAvatarClick, onInboxClick, onAddItemClick
}

export type { NavbarProps };
