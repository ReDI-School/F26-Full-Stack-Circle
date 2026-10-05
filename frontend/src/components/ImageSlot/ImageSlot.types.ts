interface ImageSlotProps {
  value?: string | null;
  placeholder?: string;
  alt?: string;
  shape?: 'rounded' | 'circle';
  className?: string;
  onChange: (url: string | null) => void;
}

export type { ImageSlotProps };
