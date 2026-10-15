// src/pages/Checkout/CheckoutSteps.tsx

import ContactForm from "../forms/ContactForm";
import ShippingAddressForm from "../forms/ShippingAddressForm";
import ShippingMethodForm from "../forms/ShippingMethodForm";
import PaymentForm from "../forms/PaymentForm";
import ReviewForm from "../forms/ReviewForm";

interface CheckoutStepsProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function CheckoutSteps({
  currentStep,
  onNext,
  onBack,
  onSubmit,
}: CheckoutStepsProps) {
  return (
    <div className="w-full">
      {currentStep === 1 && <ContactForm onNext={onNext} />}
      {currentStep === 2 && <ShippingAddressForm onNext={onNext} onBack={onBack} />}
      {currentStep === 3 && <ShippingMethodForm onNext={onNext} onBack={onBack} />}
      {currentStep === 4 && <PaymentForm onNext={onNext} onBack={onBack} />}
      {currentStep === 5 && <ReviewForm onBack={onBack} onSubmit={onSubmit} />}
    </div>
  );
}