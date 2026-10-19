import type { BannerProps } from './Banner.types';
import {
  bannerStyles,
  bannerTitleStyles,
  bannerSubtitleStyles,
  bannerContentStyles,
  bannerActionStyles,
} from './Banner.styles';

const Banner = ({
  variant,
  title,
  subtitle,
  action,
}: BannerProps) => {
  return (
    <section className={bannerStyles({ variant })}>
      {variant === 'hero' ? (
        <>
          <h1 className={bannerTitleStyles({ variant })}>
            {title}
          </h1>

          {subtitle && (
            <p className={bannerSubtitleStyles({ variant })}>
              {subtitle}
            </p>
          )}
        </>
      ) : (
        <>
          <div className={bannerContentStyles({ variant })}>
            <h2 className={bannerTitleStyles({ variant })}>
              {title}
            </h2>

            {subtitle && (
              <p className={bannerSubtitleStyles({ variant })}>
                {subtitle}
              </p>
            )}
          </div>

          {action && (
            <div className={bannerActionStyles()}>
              {action}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Banner;
