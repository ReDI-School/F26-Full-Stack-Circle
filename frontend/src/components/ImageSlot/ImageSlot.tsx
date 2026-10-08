'use client';
import { useState } from 'react';
import { imageSlotStyles } from './ImageSlot.styles';
import type { ImageSlotProps } from './ImageSlot.types';

const ImageSlot = ({
  value,
  onChange,
  shape = 'rounded',
  alt = 'Photo',
  placeholder = 'Drop the main photo',
  className,
}: ImageSlotProps) => {
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const hasError = brokenUrl === value;
  const isEmpty = hasError || !value;
  const revealOnHover =
    'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 focus-visible:opacity-100';

  return (
    <div className={`group ${imageSlotStyles({ shape, empty: isEmpty, className })}`}>
      {isEmpty ? (
        <>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <path d="m21 15-5-5L5 21"></path>
          </svg>
          <p className="text-caption">{hasError ? 'Could not load that image' : placeholder}</p>
        </>
      ) : (
        <>
          <img
            className="object-cover w-full h-full rounded-[inherit]"
            src={value}
            alt={alt}
            onError={() => {
              setBrokenUrl(value);
            }}
          ></img>
          {shape === 'circle' ? (
            <button
              type="button"
              aria-label="change image"
              className={`${revealOnHover} flex bg-surface  text-ink absolute rounded-pill size-6 justify-center items-center right-2 bottom-2 shadow-menu`}
              onClick={() => {
                onChange(null);
              }}
              title="Reframe or change the image"
            >
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 256 256">
                <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
              </svg>
            </button>
          ) : (
            <button
              title="Remove image"
              className={`${revealOnHover} flex absolute rounded-pill size-6 justify-center items-center right-2 top-2 bg-surface/70 text-ink pb-0.5`}
              aria-label="remove image"
              type="button"
              onClick={() => {
                onChange(null);
              }}
            >
              x
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ImageSlot;
