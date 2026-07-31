import UserLayout from "@/app/layouts/UserLayout";
import HomePage from "@/pages/Home/HomePage";


import LoginPage from "@/pages/Auth/LoginPage";
// import RegisterPage from "@/pages/Auth/RegisterPage";
// import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
// import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";


// Shop
import ShopPage from "@/pages/Shop/ShopPage";
import ProductPage from "@/pages/Product/ProductPage";
import CategoryPage from "@/pages/Category/CategoryPage";
// import SearchPage from "@/pages/Search/SearchPage";

// // Cart & Checkout
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/Order/OrderSuccessPage";
import OrderDetailsPage from "@/pages/Order/OrderDetailsPage";

// // Authentication

// // Profile
// import ProfilePage from "@/pages/Profile/ProfilePage";
// import OrdersPage from "@/pages/Profile/OrdersPage";
// import WishlistPage from "@/pages/Profile/WishlistPage";
// import AddressesPage from "@/pages/Profile/AddressesPage";
// import SettingsPage from "@/pages/Profile/SettingsPage";

import WishlistPage from "@/pages/Wishlist/WishlistPage";
import ProfilePage from "@/pages/Profile/ProfilePage";




export const publicRoutes = {
  path: "/",
  element: <UserLayout />,
  children: [
    { index: true, element: <HomePage /> },
    { path: '/profile', element: <ProfilePage />},
    { path: "shop", element: <ShopPage /> },

    {
      path: "products/:slug",
      element: <ProductPage />,
    },

    {
      path: "categories/:slug",
      element: <CategoryPage />,
    },

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
      element: <WishlistPage />,
    },
  ],
};