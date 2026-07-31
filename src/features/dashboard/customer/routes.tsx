import { type RouteObject } from 'react-router-dom';
import CustomerLayout from './components/CustomerLayout';
import CustomerPage from "./pages/CustomerPage";



export const customerRoutes: RouteObject = {

    element: <CustomerLayout />,
    children: [
        {
            index: true,
            element: <CustomerPage />,
        }
    ],
};