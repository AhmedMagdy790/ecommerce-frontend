import UserLayout from "@/app/layouts/UserLayout";
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/Order/OrderSuccessPage";
import OrderDetailsPage from "@/pages/Order/OrderDetailsPage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ProductPage from "@/features/product/public/pages/ProductPage";
import DynamicCmsPage from "@/pages/CMS/DynamicPage";
import { CheckoutGuard } from "@/features/checkout/components/CheckoutGuard";
import ShopPage from "@/features/Shop/ShopPage";
import { AuthGuard } from "../Guard/AuthGuard";
import { PayPalReturnPage } from "@/features/checkout/pages/payment/paypal/PayPalReturnPage";
import { PayPalCancelPage } from "@/features/checkout/pages/payment/paypal/PayPalCancelPage";
import StripeReturnPage from "@/features/checkout/pages/payment/stripe/StripeReturnPage";
import StripeCancelPage from "@/features/checkout/pages/payment/stripe/StripeCancelPage";



export const publicRoutes = {
  path: "/",
  element: <UserLayout />,
  children: [
    { index: true, element: <DynamicCmsPage /> },
    { path: "shop", element: <ShopPage /> },
    { path: "products", element: <ShopPage /> },
    { path: "products/:slug", element: <ProductPage /> },
    { path: "cart", element: <CartPage /> },
    
    {
      element: <CheckoutGuard />,
      children: [
        { path: "checkout", element: <CheckoutPage /> },
      ],
    },

    { path: "order/success/:id", element: <OrderSuccessPage /> },
    { path: "orders/:id", element: <OrderDetailsPage /> },

    // Paypal
    { path: "checkout/payment/paypal/return", element: <PayPalReturnPage /> },
    { path: "checkout/payment/paypal/cancel", element: <PayPalCancelPage /> },

    // Stripe
    { path: "checkout/payment/stripe/return", element: <StripeReturnPage /> },
    { path: "checkout/payment/stripe/cancel", element: <StripeCancelPage /> },

    { path: "pages/:slug", element: <DynamicCmsPage /> },

    // 🟢 حماية صفحة البروفايل والمسارات التابعة لها باستخدام AuthGuard
    {
      element: <AuthGuard />,
      children: [
        { path: "profile", element: <ProfilePage /> },
        // { path: "profile/orders", element: <OrdersPage /> },
        // { path: "profile/addresses", element: <AddressesPage /> },
        // { path: "profile/settings", element: <SettingsPage /> },
      ],
    },
  ],
};