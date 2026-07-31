// src/pages/Checkout/CheckoutError.tsx

interface CheckoutErrorProps {
  error: string;
}

export default function CheckoutError({ error }: CheckoutErrorProps) {
  return (
    <div className="rounded-lg border border-[var(--color-error)] bg-[var(--color-error-bg,rgba(239,68,68,0.1))] p-4 text-center">
      <p className="text-sm text-[var(--color-error)] font-medium">
        {error}
      </p>
    </div>
  );
}