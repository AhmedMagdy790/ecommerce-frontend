import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export type CheckoutStep =
  | "cart"
  | "checkout"
  | "payment"
  | "success";

interface CheckoutProgressProps {
  current: CheckoutStep;
}

const steps: CheckoutStep[] = [
  "cart",
  "checkout",
  "payment",
  "success",
];

export default function CheckoutProgress({
  current,
}: CheckoutProgressProps) {
  const { t } = useTranslation("checkout");

  const currentIndex = steps.indexOf(current);

  return (
    <nav
      aria-label="Checkout Progress"
      className="mb-10"
    >
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <li
              key={step}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full border-2
                    ${
                      completed
                        ? "border-[var(--color-success)] bg-[var(--color-success)] text-white"
                        : active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)]"
                    }
                  `}
                >
                  {completed ? (
                    <Check size={18} />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={`
                    mt-2 text-sm
                    ${
                      active
                        ? "font-semibold text-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    }
                  `}
                >
                  {t(`progress.${step}`)}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-4 h-[2px] flex-1
                    ${
                      completed
                        ? "bg-[var(--color-success)]"
                        : "bg-[var(--color-border)]"
                    }
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}