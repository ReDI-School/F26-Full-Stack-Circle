import { bannerStyles } from './Banner.styles';
import type { BannerProps } from './Banner.types';

/**
 * TODO: build the Banner.
 *
 * hero = primary bg, 26px display black title. cta = tertiary bg, 20px title, action
 * pushed to the right. Both full width, white text.
 */
const Banner = ({ title }: BannerProps) => {
  return <div className={bannerStyles()}>{title}</div>;
};

export default Banner;
