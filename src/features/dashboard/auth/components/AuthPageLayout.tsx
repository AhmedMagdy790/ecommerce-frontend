import React from "react";
import { Link } from "react-router";
import GridShape from "@/shared/components/dashboard/common/GridShape";
import { useLang } from "@/shared/context/LanguageContext";
import LanguageToggler from "@/shared/components/dashboard/common/toggleLanguage";


export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, changeLanguage, lang } = useLang();

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p>
            </div>
          </div>
        </div>
        <div className="fixed flex-col gap-3 hidden z-50 bottom-7 right-7 sm:flex">
          <LanguageToggler />
          {/* <ThemeTogglerTwo /> */}
        </div>
      </div>
    </div>
  );
}
