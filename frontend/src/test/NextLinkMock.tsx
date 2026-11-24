import type { AnchorHTMLAttributes, PropsWithChildren } from 'react';

interface NextLinkMockProps extends PropsWithChildren, AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const NextLinkMock = ({ href, children, ...props }: NextLinkMockProps) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export default NextLinkMock;
