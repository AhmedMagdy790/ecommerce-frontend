// src/features/navbar/components/NavbarFallback.jsx
export const NavbarFallback = () => {
  // Hard-coded primary links as a safety net
  const fallbackLinks = [
    { name: 'Shop All', url: '/shop' },
    { name: 'Sale', url: '/sale' },
    { name: 'Support', url: '/support' }
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="font-bold">MyStore</div>
      <div className="flex gap-4">
        {fallbackLinks.map(link => (
          <a key={link.name} href={link.url} className="hover:underline">
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
};