import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function StripeCancelPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
      <section className="w-full rounded-2xl border p-8 text-center shadow-sm">
        <XCircle
          className="mx-auto mb-4 h-16 w-16 text-amber-500"
          aria-hidden="true"
        />

        <h1 className="mb-3 text-2xl font-bold">
          Payment canceled
        </h1>

        <p className="mb-6 text-muted-foreground">
          Your payment was not completed. You can return to checkout
          and try again.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/checkout"
            className="rounded-lg bg-primary px-5 py-3 text-primary-foreground"
          >
            Back to checkout
          </Link>

          {orderId && (
            <Link
              to={`/orders/${encodeURIComponent(orderId)}`}
              className="rounded-lg border px-5 py-3"
            >
              View order
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}