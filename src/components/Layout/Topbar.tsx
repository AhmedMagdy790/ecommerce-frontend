import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useSettings } from "@/hooks/useSettings";

export default function Topbar() {
  const { settings } = useSettings();
  const { t } = useTranslation("common");

  const { messageKey, link, linkTextKey } = settings.topbar;

  return (
    <section className="bg-[var(--color-primary)] text-[var(--color-text-inverse)]">
      <div className="mx-auto max-w-[var(--container-xl)] px-4 py-2">
        <p className="text-center text-sm font-medium tracking-wide">
          {t(messageKey)}

          {link && linkTextKey && (
            <>
              {" "}
              <Link
                to={link}
                className="underline underline-offset-4 transition-opacity hover:opacity-80"
              >
                {t(linkTextKey)}
              </Link>
            </>
          )}
        </p>
      </div>
    </section>
  );
}