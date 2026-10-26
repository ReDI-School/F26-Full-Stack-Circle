import type { BannerProps } from './Banner.types';
import {
  bannerStyles,
  bannerTitleStyles,
  bannerDescriptionStyles,
  bannerContentStyles,
  bannerActionStyles,
} from './Banner.styles';

const Banner = ({ variant, title, description, action }: BannerProps) => {
  return (
    <section className={bannerStyles({ variant })}>
      {variant === 'hero' ? (
        <>
          <h1 className={bannerTitleStyles({ variant })}>{title}</h1>

          {description && <p className={bannerDescriptionStyles({ variant })}>{description}</p>}
        </>
      ) : (
        <>
          <div className={bannerContentStyles({ variant })}>
            <h2 className={bannerTitleStyles({ variant })}>{title}</h2>

            {description && <p className={bannerDescriptionStyles({ variant })}>{description}</p>}
          </div>

          {action && <div className={bannerActionStyles()}>{action}</div>}
        </>
      )}
    </section>
  );
};

export default Banner;
