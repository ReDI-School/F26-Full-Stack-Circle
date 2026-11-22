'use client';

import { useId, useState } from 'react';

import {
  baseStyles,
  cardStyles,
  buttonStyles,
  answerStyles,
  questionStyles,
  chevronStyles,
} from './FAQAccordion.styles';

import type { FAQAccordionProps } from './FAQAccordion.types';

const FAQAccordion = ({ items, defaultOpenId }: FAQAccordionProps) => {
  const instanceId = useId();

  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const handleClick = (id: string) => {
    setOpenId((currentOpenId) => (currentOpenId === id ? null : id));
  };

  return (
    <div className={baseStyles()}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        const questionId = `${instanceId}-question-${item.id}`;
        const answerId = `${instanceId}-answer-${item.id}`;

        return (
          <article className={cardStyles()} key={item.id}>
            <button
              id={questionId}
              type="button"
              className={buttonStyles()}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => handleClick(item.id)}
            >
              <span className={questionStyles()}>{item.question}</span>

              <span className={chevronStyles()} aria-hidden="true">
                {isOpen ? '-' : '+'}
              </span>
            </button>

            <div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              className={answerStyles({ open: isOpen })}
            >
              {item.answer}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
