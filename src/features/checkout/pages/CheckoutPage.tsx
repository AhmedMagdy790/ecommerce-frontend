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
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";


export default function CheckoutPage() {
  const { t } = useTranslation("checkout");
  const { isRTL, lang } = useLang();

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
      <ShippingCalculationProvider>
        <main
          dir={isRTL ? "rtl" : "ltr"}
          className="min-h-screen bg-background text-text-primary py-10 transition-colors duration-[var(--duration-normal)]"
        >
          <Container size="2xl" className="space-y-8">

            {/* Header Section */}
            <div className="space-y-2 text-center">
              <h1 
                className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t("page.title", { defaultValue: lang === "ar" ? "إتمام الشراء" : "Checkout" })}
              </h1>

              <p 
                className="text-sm text-text-secondary max-w-lg mx-auto"
                style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
              >
                {t(
                  "page.subtitle",
                  { defaultValue: lang === "ar" ? "أكمل عملية الشراء بأمان من خلال ملء الخطوات أدناه." : "Complete your purchase securely by filling out the steps below." }
                )}
              </p>
            </div>

            {/* Stepper Navigation */}
            <CheckoutStepper
              currentStep={currentStep}
              onStepClick={setStep}
            />

            {/* Submission Error Banner */}
            {error && <CheckoutError error={String(error)} />}

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

              {/* Checkout Form Container */}
              <div className="lg:col-span-7 xl:col-span-8">
                <CheckoutSteps
                  currentStep={currentStep}
                  onNext={next}
                  onBack={back}
                  onSubmit={onSubmitHandler}
                />
              </div>

              {/* Order Financial Summary Sidebar */}
              <div className="sticky top-[calc(var(--topbar-height,40px)+var(--navbar-height,70px)+var(--spacing-6))] lg:col-span-5 xl:col-span-4">
                <CheckoutSummary loading={loading} />
              </div>

            </div>
          </Container>
        </main>
      </ShippingCalculationProvider>
    </FormProvider>
  );
}