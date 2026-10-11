interface ImageSlotProps {
  value?: string | null;
  placeholder?: string;
  alt?: string;
  shape?: 'rounded' | 'circle';
  className?: string;
  /** Called with `null` when the image is removed. Omit it for read-only display: no remove button is shown. */
  onChange?: (url: string | null) => void;
}

export type { ImageSlotProps };
