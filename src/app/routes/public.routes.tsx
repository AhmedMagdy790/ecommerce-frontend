
import UserLayout from "@/app/layouts/UserLayout";
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/Order/OrderSuccessPage";
import OrderDetailsPage from "@/pages/Order/OrderDetailsPage";
import ProductPage from "@/features/product/public/pages/ProductPage";
import DynamicCmsPage from "@/pages/CMS/DynamicPage";
import ShopPage from "@/features/Shop/ShopPage";

import { CheckoutGuard } from "@/features/checkout/components/CheckoutGuard";
import { AuthGuard } from "../Guard/AuthGuard";

import { PayPalReturnPage } from "@/features/checkout/pages/payment/paypal/PayPalReturnPage";
import { PayPalCancelPage } from "@/features/checkout/pages/payment/paypal/PayPalCancelPage";
import StripeReturnPage from "@/features/checkout/pages/payment/stripe/StripeReturnPage";
import StripeCancelPage from "@/features/checkout/pages/payment/stripe/StripeCancelPage";

import ProfilePage from "@/pages/Profile/Pages/ProfilePage";
import ProfileOverviewPage from "@/pages/Profile/Pages/ProfileOverviewPage";
import SecurityPage from "@/pages/Profile/Pages/SecurityPage";
import MyOrdersPage from "@/pages/Profile/Pages/MyOrdersPage";
import AddressPage from "@/pages/Profile/Pages/AddressPage";
import AddressFormPage from "@/pages/Profile/Pages/AddressFormPage";

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
      children: [{ path: "checkout", element: <CheckoutPage /> }],
    },

    { path: "order/success/:id", element: <OrderSuccessPage /> },
    { path: "orders/:id", element: <OrderDetailsPage /> },

    { path: "checkout/payment/paypal/return", element: <PayPalReturnPage /> },
    { path: "checkout/payment/paypal/cancel", element: <PayPalCancelPage /> },
    { path: "checkout/payment/stripe/return", element: <StripeReturnPage /> },
    { path: "checkout/payment/stripe/cancel", element: <StripeCancelPage /> },

    { path: "pages/:slug", element: <DynamicCmsPage /> },

    {
      element: <AuthGuard />,
      children: [
        {
          path: "settings",
          element: <ProfileOverviewPage />,
        },
        {
          path: "settings/profile",
          element: <ProfilePage />,
        },
        {
          path: "settings/security",
          element: <SecurityPage />,
        },
        {
          path: "settings/orders",
          element: <MyOrdersPage />,
        },
        {
          path: "settings/address",
          element: <AddressPage />,
        },
        {
          path: "settings/addresses/new",
          element: <AddressFormPage />,
        }
      ],
    },

  ],
};