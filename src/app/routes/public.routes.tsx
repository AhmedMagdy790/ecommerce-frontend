import UserLayout from "@/app/layouts/UserLayout";
// import HomePage from "@/pages/Home/HomePage";

// Shop
// import SearchPage from "@/pages/Search/SearchPage";

// Cart & Checkout
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/Order/OrderSuccessPage";
import OrderDetailsPage from "@/pages/Order/OrderDetailsPage";

// Profile & Sub-pages
import ProfilePage from "@/pages/Profile/ProfilePage";
// import OrdersPage from "@/pages/Profile/OrdersPage";         // طلبات المستخدم
// import AddressesPage from "@/pages/Profile/AddressesPage";   // العناوين
// import SettingsPage from "@/pages/Profile/SettingsPage";     // الإعدادات

// import WishlistPage from "@/features/wishlist/pages/WishlistPage";
import ProductPage from "@/features/product/public/pages/ProductPage";
import DynamicCmsPage from "@/pages/CMS/DynamicPage";
import { CheckoutGuard } from "@/features/checkout/components/CheckoutGuard";
import ShopPage from "@/features/Shop/ShopPage";
// import NotFoundPage from "@/pages/NotFoundPage";

export const publicRoutes = {
  path: "/",
  element: <UserLayout />,
  children: [
    
    { index: true, element: <DynamicCmsPage /> },
    { path: "shop", element: <ShopPage /> },
    // { path: "search", element: <SearchPage /> },

    {
      path: "products/:slug",
      element: <ProductPage />,
    },
    // {
    //   path: "categories/:slug",
    //   element: <CategoryPage />,
    // },

    { path: "cart", element: <CartPage /> },
    
    {
      element: <CheckoutGuard />,
      children: [
        { path: "checkout", element: <CheckoutPage /> },
      ],
    },
    { path: "order/success/:id", element: <OrderSuccessPage /> },
    { path: "orders/:id", element: <OrderDetailsPage /> },
    // { path: "wishlist", element: <WishlistPage /> },

    // Profile Routes
    { path: "profile", element: <ProfilePage /> },


    { path: "pages/:slug", element: <DynamicCmsPage /> },
    // { path: "profile/orders", element: <OrdersPage /> },
    // { path: "profile/addresses", element: <AddressesPage /> },
    // { path: "profile/settings", element: <SettingsPage /> },

    // { path: "*", element: <NotFoundPage /> },
  ],
};