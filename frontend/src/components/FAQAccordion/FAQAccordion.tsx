'use client';

import { useState } from 'react';

import {
  baseStyles,
  cardStyles,
  buttonStyles,
  answerStyles,
  questionStyles,
  chevronStyles,
} from './FAQAccordion.styles';

import { FAQAccordionProps } from './FAQAccordion.types';
import { Minus, Plus } from 'lucide-react';

const FAQAccordion = ({ items, defaultOpenId }: FAQAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  const handleClick = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={baseStyles()}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const questionId = `faq-question-${item.id}`;
        const answerId = `faq-answer-${item.id}`;
        return (
          <article className={cardStyles()} key={item.id}>
            <button
              className={buttonStyles()}
              type="button"
              id={questionId}
              aria-controls={answerId}
              aria-expanded={isOpen}
              onClick={() => handleClick(item.id)}
            >
              <span className={questionStyles()}>{item.question}</span>
              <span className={chevronStyles()} aria-hidden="true">
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            </button>
            <div
              className={answerStyles({ open: isOpen })}
              id={answerId}
              role="region"
              aria-labelledby={questionId}
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
