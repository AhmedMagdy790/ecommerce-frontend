import { createBrowserRouter } from "react-router-dom";

import UserLayout from "@/components/Layout/UserLayout";

// Home
import HomePage from "@/pages/Home/HomePage";

// Shop
import ShopPage from "@/pages/Shop/ShopPage";
import ProductPage from "@/pages/Product/ProductPage";
import CategoryPage from "@/pages/Category/CategoryPage";
// import SearchPage from "@/pages/Search/SearchPage";

// // Cart & Checkout
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";
import OrderSuccessPage from "@/pages/Order/OrderSuccessPage";
import OrderDetailsPage from "@/pages/Order/OrderDetailsPage";

// // Authentication
// import LoginPage from "@/pages/Auth/LoginPage";
// import RegisterPage from "@/pages/Auth/RegisterPage";
// import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
// import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";

// // Profile
// import ProfilePage from "@/pages/Profile/ProfilePage";
// import OrdersPage from "@/pages/Profile/OrdersPage";
// import WishlistPage from "@/pages/Profile/WishlistPage";
// import AddressesPage from "@/pages/Profile/AddressesPage";
// import SettingsPage from "@/pages/Profile/SettingsPage";

// // Errors
import NotFoundPage from "@/pages/Errors/NotFoundPage";
import WishlistPage from "@/pages/Wishlist/WishlistPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    errorElement: <NotFoundPage />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "shop",
        element: <ShopPage />,
      },

      {
        path: "products/:slug",
        element: <ProductPage />,
      },

      {
        path: "categories/:slug",
        element: <CategoryPage />,
      },

      // {
      //   path: "search",
      //   element: <SearchPage />,
      // },

      {
        path: "cart",
        element: <CartPage />,
      },

      {
        path: "checkout",
        element: <CheckoutPage />,
      },

      {
        path: "order/success/:id",
        element: <OrderSuccessPage />,
      },

      {
        path: "orders/:id",
        element: <OrderDetailsPage />,
      },

      {
        path: "wishlist",
        element: <WishlistPage />
      },

      // {
      //   path: "login",
      //   element: <LoginPage />,
      // },

      // {
      //   path: "register",
      //   element: <RegisterPage />,
      // },

      // {
      //   path: "forgot-password",
      //   element: <ForgotPasswordPage />,
      // },

      // {
      //   path: "reset-password/:token",
      //   element: <ResetPasswordPage />,
      // },

      // {
      //   path: "profile",
      //   element: <ProfilePage />,
      // },

      // {
      //   path: "profile/orders",
      //   element: <OrdersPage />,
      // },

      // {
      //   path: "profile/wishlist",
      //   element: <WishlistPage />,
      // },

      // {
      //   path: "profile/addresses",
      //   element: <AddressesPage />,
      // },

      // {
      //   path: "profile/settings",
      //   element: <SettingsPage />,
      // },
    ],
  },
]);

export default router;