import { Logo } from '../Logo';
import { footerStyles } from './Footer.styles';
import type { FooterLink, FooterProps } from './Footer.types';

const { root, inner, brand, description, heading, list, link } = footerStyles();

interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

const FooterColumn = ({ title, links }: FooterColumnProps) => {
  return (
    <div>
      <h3 className={heading()}>{title}</h3>
      <ul className={list()}>
        {links.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={link()}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = ({ categoryLinks, infoLinks, accountLinks }: FooterProps) => {
  return (
    <footer className={root()}>
      <div className={inner()}>
        <div className={brand()}>
          <Logo size={21} />
          <p className={description()}>
            a student project by the Fullstack Circle course at ReDi School. buyers and sellers
            settle payment directly — like a flea market, but online.
          </p>
        </div>

        <FooterColumn title="categories" links={categoryLinks} />
        <FooterColumn title="how it works" links={infoLinks} />
        <FooterColumn title="my ReDiCycle" links={accountLinks} />
      </div>
    </footer>
  );
};

export default Footer;