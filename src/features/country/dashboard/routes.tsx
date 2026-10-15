import { type RouteObject } from 'react-router-dom';
import CountryListPage from './pages/CountryListPage';


export const countryRoutes: RouteObject = {
  path: "locations/countries", // 👈 تحديث المسار ليكون تحت مجلد locations
  children: [
    {
      index: true,
      element: <CountryListPage />,
    },
    // مستقبلاً يمكنك إضافة مسارات فرعية هنا مثل:
    // { path: ":id/cities", element: <CityListPage /> }
  ],
};