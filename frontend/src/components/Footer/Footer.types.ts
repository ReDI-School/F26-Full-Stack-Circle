interface FooterLink {
  label: string;
  href: string;
}
interface FooterProps {
  categoryLinks: FooterLink[];
  infoLinks: FooterLink[];
  accountLinks: FooterLink[];
}

export type { FooterLink, FooterProps };
