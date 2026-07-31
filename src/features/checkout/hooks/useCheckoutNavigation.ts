// hooks/useCheckoutNavigation.ts
export function useCheckoutNavigation(
  nextStep: () => void,
  prevStep: () => void
) {
  const scrollTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return {
    next() {
      nextStep();
      scrollTop();
    },

    back() {
      prevStep();
      scrollTop();
    },
  };
}