import { type RouteObject } from 'react-router-dom';
import PaymentLayout from './components/PaymentLayout'; // تأكد من إنشاء الـ Layout
import PaymentPage from "./pages/PaymentPage"; // الصفحة التي تعرض الجدول
import PaymentFormPage from "./pages/PaymentFormPage"; // صفحة الإضافة والتعديل

export const paymentGatewayRoutes: RouteObject = {

    element: <PaymentLayout />,
    children: [
        {
            index: true,
            element: <PaymentPage />,
        },
        {
            path: 'create',
            element: <PaymentFormPage />,
        },
        {
            path: 'edit/:id',
            element: <PaymentFormPage />,
        }
    ],
};