import { type RouteObject } from 'react-router-dom';
import ProductLayout from './components/ProductLayout';
import ProductPage from "./pages/ProductPage";



export const productRoutes: RouteObject = {

    element: <ProductLayout />,
    children: [
        {
            index: true,
            element: <ProductPage />,
        }
    ],
};