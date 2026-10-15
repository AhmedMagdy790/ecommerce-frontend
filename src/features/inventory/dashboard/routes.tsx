import { type RouteObject } from 'react-router-dom';
import InventoryLayout from './components/InventoryLayout';
import InventoryPage from '../dashboard/pages/InventoryPage';
import InventoryDetailsPage from './pages/InventoryDetailsPage';

export const inventoryRoutes: RouteObject = {
  path: "inventory",
  element: <InventoryLayout />,
  children: [
    {
      index: true,
      element: <InventoryPage />,
    },
    {
      path: ":id", // صفحة تفاصيل عنصر المخزون
      element: <InventoryDetailsPage />,
    },
  ],
};