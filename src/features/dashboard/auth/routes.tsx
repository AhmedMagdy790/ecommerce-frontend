import { type RouteObject } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicRoute from '@/app/router/PublicRoute';



export const authRoutes: RouteObject = {
  // element: <PublicRoute />,
  children: [
    { path: 'login', element: <LoginPage /> },
    { path: 'register', element: <RegisterPage /> },
  ],
};