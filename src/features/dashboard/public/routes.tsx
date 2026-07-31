import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import WebsiteLayout from "@/shared/layouts/WebsiteLayout";

// ========================
// Pages (Public)
// ========================
const HomePage = lazy(() => import("./pages/HomePage"));
// const AboutPage = lazy(() => import("./pages/AboutPage"));
// const ContactPage = lazy(() => import("./pages/ContactPage"));

// // ========================
// // Shop
// // ========================
// const ProductList = lazy(() => import("@/features/products/pages/ProductList"));
// const ProductDetails = lazy(() => import("@/features/products/pages/ProductDetails"));

// const CategoryPage = lazy(() => import("@/features/categories/pages/CategoryPage"));
// const SearchPage = lazy(() => import("@/features/search/pages/SearchPage"));

// // ========================
// // Cart & Checkout
// // ========================
// const CartPage = lazy(() => import("@/features/cart/pages/CartPage"));
// const CheckoutPage = lazy(() => import("@/features/checkout/pages/CheckoutPage"));

// // ========================
// // Wishlist
// // ========================
// const WishlistPage = lazy(() => import("@/features/wishlist/pages/WishlistPage"));

// // ========================
// // Account (User Area)
// // ========================
// const ProfilePage = lazy(() => import("@/features/account/pages/ProfilePage"));
// const OrdersPage = lazy(() => import("@/features/account/pages/OrdersPage"));
// const OrderDetailsPage = lazy(() => import("@/features/account/pages/OrderDetailsPage"));

// const SettingsPage = lazy(() => import("@/features/account/pages/SettingsPage"));
// const AddressesPage = lazy(() => import("@/features/account/pages/AddressesPage"));
// const SecurityPage = lazy(() => import("@/features/account/pages/SecurityPage"));

// // ========================
// // Auth
// // ========================
// const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
// const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
// const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
// const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));

// // ========================
// // Error Pages
// // ========================
// const NotFoundPage = lazy(() => import("@/shared/pages/NotFoundPage"));

export const publicRoutes: RouteObject = {
  path: "/",
  element: <WebsiteLayout />,
  children: [
    // ======================
    // Home
    // ======================
    { index: true, element: <HomePage /> },

    // ======================
    // Shop
    // ======================
    // { path: "products", element: <ProductList /> },
    // { path: "products/:slug", element: <ProductDetails /> },
    // { path: "categories/:slug", element: <CategoryPage /> },
    // { path: "search", element: <SearchPage /> },

    // // ======================
    // // Cart & Checkout
    // // ======================
    // { path: "cart", element: <CartPage /> },
    // { path: "checkout", element: <CheckoutPage /> },

    // // ======================
    // // Wishlist
    // // ======================
    // { path: "wishlist", element: <WishlistPage /> },

    // // ======================
    // // Account
    // // ======================
    // { path: "profile", element: <ProfilePage /> },
    // { path: "account/orders", element: <OrdersPage /> },
    // { path: "account/orders/:id", element: <OrderDetailsPage /> },

    // { path: "account/settings", element: <SettingsPage /> },
    // { path: "account/addresses", element: <AddressesPage /> },
    // { path: "account/security", element: <SecurityPage /> },

    // // ======================
    // // Auth
    // // ======================
    // { path: "login", element: <LoginPage /> },
    // { path: "register", element: <RegisterPage /> },
    // { path: "forgot-password", element: <ForgotPasswordPage /> },
    // { path: "reset-password", element: <ResetPasswordPage /> },

    // // ======================
    // // Static Pages
    // // ======================
    // { path: "about", element: <AboutPage /> },
    // { path: "contact", element: <ContactPage /> },

    // // ======================
    // // 404
    // // ======================
    // { path: "*", element: <NotFoundPage /> },
  ],
};