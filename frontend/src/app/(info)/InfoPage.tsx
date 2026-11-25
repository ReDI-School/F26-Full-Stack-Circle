'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import Banner from '@/components/Banner/Banner';
import Button from '@/components/Button/Button';

import { infoPageStyles } from '@/app/(info)/InfoPage.styles';

interface InfoPageProps {
  title: string;
  subline: string;
  children: ReactNode;
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
    href: string;
  };
}

const InfoPage = ({ title, subline, children, cta }: InfoPageProps) => {
  const router = useRouter();
  const styles = infoPageStyles();

  return (
    <div className={styles.root()}>
      <Banner variant="hero" title={title} description={subline} />

      <div className={styles.body()}>{children}</div>

      <div className="mt-auto shrink-0">
        <Banner
          variant="cta"
          title={cta.title}
          description={cta.description}
          action={
            <Button type="button" variant="primary" onClick={() => router.push(cta.href)}>
              {cta.buttonLabel}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default InfoPage;
