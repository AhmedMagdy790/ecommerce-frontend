import { useTranslation } from "react-i18next";
import {
  MapPin,
  Plus,
  RefreshCw,
  Star,
  Pencil,
  Trash2,
  House,
  BriefcaseBusiness,
  Building2,
  MapPinned,
} from "lucide-react";

import { Link } from "react-router-dom";

import { ROUTES } from "@/constants/navigation";
import { useAddressPage } from "@/features/address/hooks/useAddressPage";
import type { Address } from "@/features/address/model/types/address.types";


export default function AddressPage() {
  const { t } = useTranslation("address");

  const {
    addresses,
    isLoading,
    isSubmitting,
    error,
    refresh,
    setDefaultAddress,
    deleteAddress,
  } = useAddressPage();

  const getAddressType = (type: string) => {
    switch (type) {
      case "home":
        return {
          label: t("types.home", { defaultValue: "Home" }),
          Icon: House,
        };

      case "work":
        return {
          label: t("types.work", { defaultValue: "Work" }),
          Icon: BriefcaseBusiness,
        };

      case "office":
        return {
          label: t("types.office", { defaultValue: "Office" }),
          Icon: Building2,
        };

      default:
        return {
          label: t("types.other", { defaultValue: "Other" }),
          Icon: MapPinned,
        };
    }
  };

  const handleDelete = async (address: Address) => {
    const confirmed = window.confirm(
      t("confirmDelete", {
        defaultValue: "Are you sure you want to delete this address?",
      }),
    );

    if (!confirmed) return;

    await deleteAddress(address.id);
  };

  return (
    <main className="min-h-[80vh] bg-background px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <nav aria-label={t("breadcrumb", { defaultValue: "Breadcrumb" })}>
          <Link
            to={ROUTES.SETTINGS}
            className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            {t("backToAccount", { defaultValue: "Your Account" })}
          </Link>
        </nav>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary">
              <MapPin className="size-5" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {t("title", { defaultValue: "My Addresses" })}
            </h1>

            <p className="mt-2 text-sm leading-6 text-text-secondary sm:text-base">
              {t("description", {
                defaultValue:
                  "Manage your delivery addresses and default location.",
              })}
            </p>
          </div>

          <Link
            to={ROUTES.ADDRESS_CREATE}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("addAddress", { defaultValue: "Add address" })}
          </Link>
        </header>

        {error && (
          <div
            className="mt-6 flex flex-col gap-3 rounded-panel border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            role="alert"
          >
            <p className="text-sm text-text-primary">{error}</p>

            <button
              type="button"
              onClick={() => void refresh()}
              disabled={isLoading}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-control border border-border px-3 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-50"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              {t("retry", { defaultValue: "Try again" })}
            </button>
          </div>
        )}

        {isLoading ? (
          <section
            className="mt-8 grid gap-4"
            aria-label={t("loading", { defaultValue: "Loading addresses" })}
            aria-busy="true"
          >
            {Array.from([1,2,3], (_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-panel border border-border bg-surface p-5"
              >
                <div className="h-5 w-1/3 rounded-control bg-surface-secondary" />
                <div className="mt-4 h-4 w-2/3 rounded-control bg-surface-secondary" />
                <div className="mt-3 h-4 w-1/2 rounded-control bg-surface-secondary" />
              </div>
            ))}
          </section>
        ) : addresses?.length === 0 ? (
          <section className="mt-8 flex flex-col items-center rounded-panel border border-dashed border-border bg-surface px-5 py-12 text-center sm:py-16">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-secondary text-text-secondary">
              <MapPin className="size-7" aria-hidden="true" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-text-primary">
              {t("empty.title", { defaultValue: "No addresses yet" })}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
              {t("empty.description", {
                defaultValue:
                  "Add an address to make checkout and delivery easier.",
              })}
            </p>

            <Link
              to={ROUTES.ADDRESS_CREATE}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Plus className="size-4" aria-hidden="true" />
              {t("addAddress", { defaultValue: "Add address" })}
            </Link>
          </section>
        ) : (
          <section
            className="mt-8 grid gap-4"
            aria-label={t("listLabel", { defaultValue: "Saved addresses" })}
          >
            {addresses && addresses?.map((address) => {
              const { label, Icon } = getAddressType(address.type);

              return (
                <article
                  key={address.id}
                  className="min-w-0 rounded-panel border border-border bg-surface p-4 shadow-sm transition-colors sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-text-secondary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-text-primary">
                          {label}
                        </h2>

                        {address.is_default && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-secondary px-2.5 py-1 text-xs font-medium text-text-primary">
                            <Star
                              className="size-3"
                              aria-hidden="true"
                            />
                            {t("defaultAddress", {
                              defaultValue: "Default",
                            })}
                          </span>
                        )}
                      </div>

                      <p className="mt-2 break-words text-sm leading-6 text-text-secondary">
                        {address.street_details}
                      </p>

                      {(address.area || address.building_number) && (
                        <p className="mt-1 break-words text-sm text-text-secondary">
                          {[address.area, address.building_number]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}

                      <p className="mt-1 text-sm text-text-secondary">
                        {[address.city?.name, address.country?.name]
                          .filter(Boolean)
                          .join(", ")}
                      </p>

                      {address.phone_contact && (
                        <p
                          className="mt-2 text-sm text-text-secondary"
                          dir="ltr"
                        >
                          {address.phone_contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    {!address.is_default && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() =>
                          void setDefaultAddress(address.id)
                        }
                        className="inline-flex min-h-10 items-center gap-2 rounded-control border border-border px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary disabled:opacity-50"
                      >
                        <Star className="size-4" aria-hidden="true" />
                        {t("makeDefault", {
                          defaultValue: "Set as default",
                        })}
                      </button>
                    )}

                    <Link
                      to={ROUTES.ADDRESS_EDIT(address.id)}
                      aria-label={t("editAddress", {
                        defaultValue: "Edit address",
                      })}
                      className="inline-flex min-h-10 items-center gap-2 rounded-control border border-border px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      {t("edit", { defaultValue: "Edit" })}
                    </Link>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleDelete(address)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-control border border-border px-3 text-sm font-medium text-text-primary transition-colors hover:border-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      {t("delete", { defaultValue: "Delete" })}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}