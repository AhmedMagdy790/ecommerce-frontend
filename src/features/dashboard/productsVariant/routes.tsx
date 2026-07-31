import { type RouteObject } from 'react-router-dom';
import ProductVariantsLayout from './components/ProductVariantsLayout';
import ProductVariantPage from "./pages/ProductVariantPage";



export const productVariantRoutes: RouteObject = {

    element: <ProductVariantsLayout />,
    children: [
        {
            index: true,
            element: <ProductVariantPage />,
        }
    ],
};