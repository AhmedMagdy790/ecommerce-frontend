import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "@/constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const USER_LINKS = [
  {
    name: "Wishlist",
    href: "/wishlist",
  },
  {
    name: "Profile",
    href: "/profile",
  },
  {
    name: "Orders",
    href: "/orders",
  },
];


export default function MobileMenu({
  isOpen,
  onClose,
}: MobileMenuProps) {

  if (!isOpen) return null;


  return (
    <div
      className="
        border-t
        border-border
        bg-background
        shadow-lg
        lg:hidden
      "
    >

      <nav className="flex flex-col py-4">


        {/* Main Navigation */}
        {NAV_LINKS.map((link) => (

          <NavLink
            key={link.name}
            to={link.href}
            onClick={onClose}
            className="
              px-6
              py-3
              text-sm
              font-medium
              text-text-secondary
              transition-colors
              hover:bg-surface
              hover:text-primary
            "
          >
            {link.name}
          </NavLink>

        ))}



        {/* User Navigation */}
        <div className="mt-4 border-t border-border pt-4">

          {USER_LINKS.map((link) => (

            <NavLink
              key={link.name}
              to={link.href}
              onClick={onClose}
              className="
                px-6
                py-3
                text-sm
                font-medium
                text-text-secondary
                transition-colors
                hover:bg-surface
                hover:text-primary
              "
            >
              {link.name}
            </NavLink>

          ))}

        </div>


      </nav>

    </div>
  );
}