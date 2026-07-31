import { type RouteObject } from 'react-router-dom';
import OrdersLayout from './components/OrdersLayout';
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessPage from "./pages/OrderSuccessPage"; // افترضنا وجود هذا الملف

export const ordersRoutes: RouteObject = {

    element: <OrdersLayout />,
    children: [
        { index: true, element: <OrdersPage /> }, // الجدول الرئيسي
        // { path: ':id', element: <OrderDetailPage /> }, // تفاصيل طلب محدد
        { path: 'success/:orderId', element: <OrderSuccessPage /> }, // صفحة النجاح
        // { path: 'failed', element: <OrderFailedPage /> }, // صفحة الفشل
    ],
};

