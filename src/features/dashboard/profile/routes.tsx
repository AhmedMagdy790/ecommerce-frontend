import ProfileLayout from './components/ProfileLayout';
import UserAddressPage from './pages/UserAddressPage'; // تأكد من إنشاء هذه الصفحات
import UserSecurityPage from './pages/UserSecurityPage';
import UserInfoPage from './pages/UserInfoPage';

export const profileRoutes = {

  element: <ProfileLayout /> ,
  children: [
    {
      index: true,
      element: <UserInfoPage />,
    },
    {
      path: 'addresses',
      element: <UserAddressPage />,
    },
    {
      path: 'security',
      element: <UserSecurityPage />,
    },
  ],
};