// src/components/layout/NavLink.tsx
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export const NavLink = ({ href, children, active }: NavLinkProps) => {
  return (
    <a
      href={href}
      className={`text-sm font-medium transition-colors duration-200 
        ${active ? 'text-primary' : 'text-gray-600 hover:text-primary'}
      `}
    >
      {children}
    </a>
  );
};