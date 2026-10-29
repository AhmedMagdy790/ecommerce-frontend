import { useGlobalErrorStore } from "@/shared/store/useGlobalErrorStore";


export function GlobalErrorRenderer() {
  const dialog = useGlobalErrorStore((state) => state.dialog);
  const closeDialog = useGlobalErrorStore(
    (state) => state.closeDialog,
  );

  if (!dialog) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={closeDialog}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="global-error-title"
        aria-describedby="global-error-message"
        className="w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          >
            !
          </span>

          <h2
            id="global-error-title"
            className="text-lg font-semibold"
          >
            {dialog.title}
          </h2>
        </div>

        <p
          id="global-error-message"
          className="text-sm leading-6 text-gray-600 dark:text-gray-300"
        >
          {dialog.message}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            autoFocus
            onClick={closeDialog}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            حسنًا
          </button>
        </div>
      </section>
    </div>
  );
}