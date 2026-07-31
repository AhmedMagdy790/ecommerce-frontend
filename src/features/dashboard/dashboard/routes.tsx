import { lazy, Suspense, type RouteObject } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from '@/app/layouts/DashboardLayout'; 
import { AdminGuard } from '@/app/Guard/AdminGuard'; 
import Dashboard from './pages/Dashboard'; 


const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
  </div>
);

// استيراد ملفات الـ Routes بشكل كسول (Lazy Loading) لحل مشكلة الـ 400 طلب والـ LCP
const profileRoutesLazy = lazy(() => import('../profile/routes').then(m => ({ default: m.profileRoutes })));
const categoryRoutesLazy = lazy(() => import('../category/routes').then(m => ({ default: m.categoryRoutes })));
const countryRoutesLazy = lazy(() => import('../country/routes').then(m => ({ default: m.countryRoutes })));
const cityRoutesLazy = lazy(() => import('../city/routes').then(m => ({ default: m.cityRoutes })));
const productRoutesLazy = lazy(() => import('../products/routes').then(m => ({ default: m.productRoutes })));
const productVariantRoutesLazy = lazy(() => import('../productsVariant/routes').then(m => ({ default: m.productVariantRoutes })));
const ordersRoutesLazy = lazy(() => import('../orders/routes').then(m => ({ default: m.ordersRoutes })));
const shippingRoutesLazy = lazy(() => import('../couriers/routes').then(m => ({ default: m.shippingRoutes })));
const customerRoutesLazy = lazy(() => import('../customer/routes').then(m => ({ default: m.customerRoutes })));
const paymentGatewayRoutesLazy = lazy(() => import('../payment/routes').then(m => ({ default: m.paymentGatewayRoutes })));


const LazyRoute = ({ component: Component }: { component: React.LazyExoticRoute<any> }) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const dashboardRoutes: RouteObject = {
  element: <AdminGuard />,
  children: [
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [

        { index: true, element: <Dashboard /> },

        {
          element: <Outlet />,
          children: [
            { path: 'profile/*', element: <LazyRoute component={profileRoutesLazy} /> },
            { path: 'categories/*', element: <LazyRoute component={categoryRoutesLazy} /> },
            { path: 'countries/*', element: <LazyRoute component={countryRoutesLazy} /> },
            { path: 'cities/*', element: <LazyRoute component={cityRoutesLazy} /> },
            { path: 'products/*', element: <LazyRoute component={productRoutesLazy} /> },
            { path: 'product-variants/*', element: <LazyRoute component={productVariantRoutesLazy} /> },
            { path: 'orders/*', element: <LazyRoute component={ordersRoutesLazy} /> },
            { path: 'shipping/*', element: <LazyRoute component={shippingRoutesLazy} /> },
            { path: 'customers/*', element: <LazyRoute component={customerRoutesLazy} /> },
            { path: 'payment-gateways/*', element: <LazyRoute component={paymentGatewayRoutesLazy} /> },
          ],
        },
      ],
    },
  ],
};