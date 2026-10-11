interface ImageSlotProps {
  value?: string | null;
  placeholder?: string;
  alt?: string;
  shape?: 'rounded' | 'circle';
  className?: string;
  /** Called with `null` when the image is removed. Omit it for read-only display: no remove button is shown. */
  onChange?: (url: string | null) => void;
  // TODO: v1 has no edit actions yet. Planned: the pencil opens a menu with upload / reframe / remove.
  /** Called when the pencil button is clicked and the menu is visible. */
  onUpload?: () => void;
  /** Called when the pencil button is clicked and the menu is visible. */
  onScale?: () => void;
}

export type { ImageSlotProps };
