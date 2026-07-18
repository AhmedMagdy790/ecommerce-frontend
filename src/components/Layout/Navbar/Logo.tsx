import { Link } from "react-router-dom";
import { appConfig } from "@/config/app";

export default function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <img
        src={appConfig.logo}
        alt={appConfig.name}
        className="h-10 w-10"
      />

      <span className="text-xl font-bold">
        {appConfig.name}
      </span>
    </Link>
  );
}