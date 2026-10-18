// src/pages/Checkout/CheckoutPage.tsx

import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import CheckoutStepper from "../components/CheckoutStepper";
import CheckoutSummary from "../components/CheckoutSummary";
import CheckoutSteps from "../components/CheckoutSteps";
import CheckoutError from "../components/CheckoutError";

import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { useCheckoutStep } from "../hooks/useCheckoutStep";
import { useCheckoutSubmit } from "../hooks/useCheckoutSubmit";
import { ShippingCalculationProvider } from "../context/ShippingCalculationProvider";



export default function CheckoutPage() {
  const { t } = useTranslation("checkout");

  const methods = useCheckoutForm();

  const {
    currentStep,
    next,
    back,
    setStep,
  } = useCheckoutStep(methods.trigger);

  const {
    submit,
    loading,
    error,
  } = useCheckoutSubmit();


  const onSubmitHandler = methods.handleSubmit(
    async (data) => {
      await submit(data);
    },
    (errors) => {
      console.log("Checkout validation errors:", errors);
    }
  );

  return (
    <FormProvider {...methods}>
      {/* تغليف صفحة الـ Checkout أو الأجزاء التي تحتاج لحساب الشحن بهذا المزود */}
      <ShippingCalculationProvider>
        <div className="min-h-screen bg-[var(--color-background)] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">

            {/* Header */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                {t("page.title", "Checkout")}
              </h1>

              <p className="text-sm text-[var(--color-text-secondary)]">
                {t(
                  "page.subtitle",
                  "Complete your purchase securely by filling out the steps below."
                )}
              </p>
            </div>

            {/* Stepper Navigation */}
            <CheckoutStepper
              currentStep={currentStep}
              onStepClick={setStep}
            />

            {/* Submission Error */}
            {error && <CheckoutError error={String(error)} />}

            {/* Main Layout */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

              {/* Checkout Form */}
              <div className="lg:col-span-7 xl:col-span-8">
                <CheckoutSteps
                  currentStep={currentStep}
                  onNext={next}
                  onBack={back}
                  onSubmit={onSubmitHandler}
                />
              </div>

              {/* Order Summary */}
              <div className="sticky top-6 lg:col-span-5 xl:col-span-4">
                <CheckoutSummary loading={loading} />
              </div>

            </div>
          </div>
        </div>
      </ShippingCalculationProvider>
    </FormProvider>
  );
}