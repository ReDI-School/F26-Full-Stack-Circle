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
  /** Optional brand colour override; otherwise derived from the name. */
  colour?: AvatarColour;
  /** Allows composed components to adjust the avatar's dimensions. */
  className?: string;
}

type AvatarColour = 'bg-primary' | 'bg-secondary' | 'bg-tertiary';

export type { AvatarProps, AvatarColour };
