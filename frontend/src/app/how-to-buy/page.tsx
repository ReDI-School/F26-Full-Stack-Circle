import type { Metadata } from 'next';

import InfoPage from '@/app/(info)/InfoPage';
import StepCard from '@/components/StepCard/StepCard';
import { infoPages } from '@/content/info';

const content = infoPages.howToBuy;

export const metadata: Metadata = {
  title: `${content.title} | ReDiCycle`,
  description: content.subline,
};

const HowToBuyPage = () => {
  return (
    <InfoPage title={content.title} subline={content.subline} cta={content.cta}>
      <ol className="grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
        {content.steps.map((step) => (
          <li key={step.step}>
            <StepCard markerType="number" step={step.step} title={step.title} text={step.text} />
          </li>
        ))}
      </ol>
    </InfoPage>
  );
};

export default HowToBuyPage;
