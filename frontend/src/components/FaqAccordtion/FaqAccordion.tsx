import type { FaqItem } from "./FaqAccordion.types";
import { AccordionContainer } from "./FaqAccordion.styles"
 type FaqAccordionProps = {
    items: FaqItem[];
 };

 export const FaqAccordion = ({ items }: FaqAccordionProps) => {
    return (
        <AccordionContainer>
            {items.map((item)=> (
            <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
             </div>
             ))}
        </AccordionContainer>
    );
 };