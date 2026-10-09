interface AvatarProps {
  /**
   * The name of the person, used for the initials and colour
   */
  name: string;

  /**
   * Optional profile picture
   */
  src?: string;

  /**
   * Avatar size
   */
  size?: 'sm' | 'md' | 'lg';
}

type AvatarColour = 'bg-primary' | 'bg-secondary' | 'bg-tertiary';

export type { AvatarProps, AvatarColour };
