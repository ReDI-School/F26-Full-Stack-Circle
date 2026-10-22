interface FAQAccordionProps {
  // List of FAQ entries. Each has a unique 'id'.
  items: {
    id: string;
    question: string;
    answer: string;
  }[];

  // The 'id' of the item that is expanded on first render.
  defaultOpenId?: string;
}

export type { FAQAccordionProps };
