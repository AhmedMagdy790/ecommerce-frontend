import { useCartStore } from "../store/cartStore";



// Add these to your state (using Zustand's capability to access store)
export const useCartCalculations = () => {
  const items = useCartStore((state) => state.items);
  
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  return { totalCount, totalPrice };
};