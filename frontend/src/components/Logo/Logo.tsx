import { logoStyles, wordmarkStyles } from './Logo.styles';
import type { LogoProps } from './Logo.types';

/** The wordmark grows with the mark, so the two always look balanced. */
const wordmarkSize = (size: number) => {
  if (size <= 22) return 'sm';
  if (size >= 44) return 'lg';

  return 'md';
};

const Logo = ({ size = 28, withWordmark = true }: LogoProps) => {
  return (
    <span className={logoStyles()}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 473.681 473.681"
        role="img"
        aria-label="ReDiCycle"
      >
        <path
          fill="#EF5A22"
          d="M0.002,236.842C0.002,106.024,106.037,0,236.837,0c130.807,0,236.842,106.028,236.842,236.842 c0,130.795-106.036,236.838-236.842,236.838C106.037,473.681,0.002,367.637,0.002,236.842z"
        />
        <path
          fill="#FFFFFF"
          d="M382.65,161.894c-2.393-4.645-14.031-15.284-33.664-5.621c-19.633,9.663-10.149,30.881-10.149,30.881 c7.318,15.011,11.439,31.861,11.439,49.688c0,62.649-50.787,113.44-113.44,113.44c-62.645,0-113.436-50.791-113.436-113.44 c0-58.64,44.486-106.873,101.537-112.819v29.397c0,0-0.079,1.758,1.743,2.865c1.821,1.111,3.646,0,3.646,0l94.106-55.454 c0,0,2.113-1.111,2.113-3.276c0-1.791-2.113-3.063-2.113-3.063L230.64,39.355c0,0-2.139-1.529-4.042-0.789 c-1.9,0.737-1.66,3.328-1.66,3.328v31.495C139.97,79.492,72.92,150.305,72.92,236.842c0,90.528,73.389,163.917,163.917,163.917 c90.531,0,163.924-73.389,163.924-163.917C400.761,209.824,394.22,184.35,382.65,161.894z"
        />
      </svg>

      {withWordmark ? (
        <span className={wordmarkStyles({ size: wordmarkSize(size) })}>
          ReDiCycle<span className="text-secondary">.</span>
        </span>
      ) : null}
    </span>
  );
};

export default Logo;
