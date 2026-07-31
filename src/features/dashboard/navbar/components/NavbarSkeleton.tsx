// src/features/navbar/components/NavbarSkeleton.jsx
export const NavbarSkeleton = () => {
  return (
    <nav className="h-16 bg-white border-b animate-pulse px-4 flex items-center justify-between">
      {/* Brand Placeholder */}
      <div className="w-24 h-6 bg-gray-200 rounded"></div>
      
      {/* Links Placeholder */}
      <div className="flex gap-6">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
      
      {/* Search & Cart Placeholder */}
      <div className="flex gap-4">
        <div className="w-32 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </nav>
  );
};