import { Link } from "react-router";
import { ChevronLeftIcon } from "@/assets/icons";

export default function RegisterHeader() {
  return (
    <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <ChevronLeftIcon className="size-5" />
        Back to dashboard
      </Link>
    </div>
  );
}