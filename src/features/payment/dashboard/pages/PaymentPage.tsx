// src/features/payment/ui/PaymentGatewaysPage.tsx
import { useCallback, useMemo } from "react";
import { CreditCard, PlusIcon } from "lucide-react";
import DataTable from "@/shared/components/DataTable/DataTable";
import { useLang } from "@/shared/context/LanguageContext";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { getPaymentGatewayColumns } from "../constants/paymentGatewayColumns";
import type { PaymentGateway } from "../../model/types/payment.types";
import { usePaymentGatewayPage } from "../../hooks/usePaymentGatewayPage";
import PaymentStats from "../components/PaymentStats";
import PaymentGatewayModal from "../components/PaymentGatewayModal";


export default function PaymentGatewaysPage() {
  const { t } = useTranslation("payment");
  const { lang } = useLang();

  const {
    currentData,
    stats,
    isLoading,
    pagination,
    showTrashed,
    setShowTrashed,
    handleServerFilterOrPageChange,
    paymentFilters,

    isOpen: isModalOpen,
    editingItem: editingGateway,
    openCreateModal,
    openEditModal,
    closeModal,

    handleDelete,
    handleRestore,
    handleStatusChange,
    togglingId,
  } = usePaymentGatewayPage();

  const handleDeleteRow = useCallback(
    (item: PaymentGateway) => handleDelete(item.id),
    [handleDelete]
  );

  const columns = useMemo(
    () =>
      getPaymentGatewayColumns({
        t,
        lang,
        showTrashed,
        togglingId,
        onStatusChange: handleStatusChange,
      }),
    [t, lang, showTrashed, togglingId, handleStatusChange]
  );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-[var(--color-primary)] shrink-0" />
          <span>{lang === "ar" ? "إدارة بوابات الدفع" : "Payment Gateways Management"}</span>
        </h1>

        <div className="flex items-center gap-3">
          <Button
            variant={showTrashed ? "outline" : "secondary"}
            onClick={() => setShowTrashed(!showTrashed)}
          >
            {showTrashed ? t("view_active") : t("view_trashed")}
          </Button>

          {!showTrashed && (
            <Button onClick={openCreateModal} className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              <span>{lang === "ar" ? "إضافة بوابة دفع" : "Add Gateway"}</span>
            </Button>
          )}
        </div>
      </div>

      {stats && <PaymentStats stats={stats} />}

      {/* DataTable Component */}
      <DataTable<PaymentGateway>
        data={currentData}
        loading={isLoading}
        showTrashed={showTrashed}
        meta={pagination}
        paginationMode={pagination?.type || "server"}
        filterSideServer={handleServerFilterOrPageChange}
        columns={columns}
        filterFields={paymentFilters}
        onDelete={handleDeleteRow}
        onEdit={(item) => openEditModal(item)}
        onRestore={(item) => handleRestore(item.id)}
      />

      {/* Payment Gateway Modal (Create / Edit) */}
      <PaymentGatewayModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        gateway={editingGateway}
      />
    </div>
  );
}