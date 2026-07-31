import { Link } from "react-router";

const HeaderLogo: React.FC = () => {
  return (
    <Link to="/" className="lg:hidden">
      <img
        className="dark:hidden"
        src="/images/logo/logo.svg"
        alt="Logo"
      />

      <img
        className="hidden dark:block"
        src="/images/logo/logo-dark.svg"
        alt="Logo"
      />
    </Link>
  );
};

export default HeaderLogo;