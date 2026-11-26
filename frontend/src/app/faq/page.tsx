import type { Metadata } from 'next';

import InfoPage from '@/app/(info)/InfoPage';
import FAQAccordion from '@/components/FAQAccordion/FAQAccordion';
import { infoPages } from '@/content/info';

const content = infoPages.faq;

export const metadata: Metadata = {
  title: `${content.title} | ReDiCycle`,
  description: content.subline,
};

const SatetyTips = () => {
  return (
    <InfoPage title={content.title} subline={content.subline} cta={content.cta}>
      <FAQAccordion items={content.steps} />
    </InfoPage>
  );
};

export default SatetyTips;
