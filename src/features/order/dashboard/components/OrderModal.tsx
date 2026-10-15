// src/features/order/dashboard/components/OrderModal.tsx
import { useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import { User, Phone, MapPin, CreditCard, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import type { IModal } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { Textarea } from "@/shared/components/Textarea";

import { ActionButtons } from "@/shared/components/ActionButtons";
import { useOrderForm } from "../hook/useOrderForm";
import type { Order } from "../../model/types/order.types";

interface IOrderModal extends IModal {
  order?: Order | null;
}

export default function OrderModal({ isOpen, closeModal, order }: IOrderModal) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useOrderForm(order, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const paymentMethodOptions = useMemo(() => [
    { label: t("payment.cash", "Cash on Delivery"), value: "cash" },
    { label: t("payment.online", "Online Payment"), value: "online" },
    { label: t("payment.wallet", "Mobile Wallet"), value: "wallet" },
  ], [t]);

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      action={
        <ActionButtons
          closeModal={closeModal}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          formRef={formRef}
          t={t}
        />
      }
      title={
        isEditMode
          ? t("order.editOrder", "Edit Order")
          : t("order.addNewOrder", "Create New Order")
      }
      description={t("order.modalDescription", "Enter order and customer details to manage it in store")}
      maxWidth="max-w-2xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          
          {/* قسم بيانات العميل */}
          <div className="border-b pb-3 mb-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
            {t("order.sections.customer", "Customer Information")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("order.customerName", "Customer Name")}
              placeholder={t("order.namePlaceholder", "e.g. Ahmed Magdy")}
              error={errors.customer_name?.message}
              icon={<User size={16} />}
              {...register("customer_name")}
            />

            <Input
              label={t("order.phonePrimary", "Primary Phone")}
              placeholder={t("order.phonePlaceholder", "+20...")}
              error={errors.phone_primary?.message}
              icon={<Phone size={16} />}
              {...register("phone_primary")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("order.phoneSecondary", "Secondary Phone (Optional)")}
              placeholder={t("order.phonePlaceholder", "+20...")}
              error={errors.phone_secondary?.message}
              icon={<Phone size={16} />}
              {...register("phone_secondary")}
            />

            <Input
              label={t("order.email", "Email (Optional)")}
              placeholder="example@domain.com"
              error={errors.customer_email?.message}
              icon={<User size={16} />}
              {...register("customer_email")}
            />
          </div>

          {/* قسم الشحن والعنوان */}
          <div className="border-b pb-3 mb-2 pt-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
            {t("order.sections.shipping", "Shipping Details")}
          </div>

          <Textarea
            label={t("order.shippingAddress", "Detailed Shipping Address")}
            placeholder={t("order.addressPlaceholder", "Street, Building, Floor...")}
            error={errors.shipping_address?.message}
            {...register("shipping_address")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label={t("order.cityId", "City ID")}
              placeholder="e.g. 31756"
              error={errors.city_id?.message}
              icon={<MapPin size={16} />}
              {...register("city_id", { valueAsNumber: true })}
            />

            <Input
              type="number"
              label={t("order.shippingCourierId", "Shipping Courier ID")}
              placeholder="e.g. 1"
              error={errors.shipping_rate_id?.message}
              icon={<Truck size={16} />}
              {...register("shipping_rate_id", { valueAsNumber: true })}
            />
          </div>

          {/* قسم الدفع والملاحظات */}
          <div className="border-b pb-3 mb-2 pt-2 font-semibold text-sm text-gray-700 dark:text-gray-300">
            {t("order.sections.payment", "Payment & Notes")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="payment_gateway_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("order.paymentMethod", "Payment Method")}
                  disabled={isSubmitting}
                  placeholder={t("order.selectPayment", "Select Payment Method...")}
                  options={paymentMethodOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.payment_gateway_id?.message}
                />
              )}
            />

            <Input
              label={t("order.couponCode", "Coupon Code (Optional)")}
              placeholder="e.g. SAVE20"
              error={errors.coupon_code?.message}
              icon={<CreditCard size={16} />}
              {...register("coupon_code")}
            />
          </div>

          <Textarea
            label={t("order.notes", "Order Notes (Optional)")}
            placeholder={t("order.notesPlaceholder", "Any special notes for the order...")}
            error={errors.notes?.message}
            {...register("notes")}
          />

        </div>
      </form>
    </BaseModel>
  );
}