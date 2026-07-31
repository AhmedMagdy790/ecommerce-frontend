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
    (data) => {
      console.log("Form is valid, submitting data...", data);
      submit(data);
    },
    (errors) => {
      // هذه الدالة ستعمل إذا كان هناك حقل غير مطابق للـ Zod Schema
      console.log("Validation Errors:", errors);
    }
  );

  console.log("error", error)

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-[var(--color-background)] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {t("page.title", "Checkout")}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t("page.subtitle", "Complete your purchase securely by filling out the steps below.")}
            </p>
          </div>

          {/* Stepper Navigation */}
          <CheckoutStepper currentStep={currentStep} onStepClick={setStep} />

          {error && <CheckoutError error={error} />}

          {/* Main Layout: Form Steps & Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <CheckoutSteps
                currentStep={currentStep}
                onNext={next}
                onBack={back}
                onSubmit={onSubmitHandler}
              />
            </div>

            <div className="lg:col-span-5 xl:col-span-4 sticky top-6">
              <CheckoutSummary loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}