import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
// import DashboardApp from './pages/DashboardApp';
// import Products from './pages/Products';
// import Blog from './pages/Blog';
// import User from './pages/User';
import NotFound from './pages/Page404';
import AdminDashboard from './pages/Dashboard/SuperAdmin';
import UsersListPage from './pages/Dashboard/SuperAdmin/UsersListPage';
import BookingsPage from './pages/Dashboard/SuperAdmin/BookingsPage';
import Credits from './pages/Dashboard/SuperAdmin/Credits';
import TicketList from './pages/Dashboard/SuperAdmin/TicketList';
import AdminSetting from './pages/Dashboard/SuperAdmin/Setting';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '', element: <AdminDashboard /> },
        { path: 'agents', element: <UsersListPage /> },
        { path: 'bookings', element: <BookingsPage /> },
        { path: 'credits', element: <Credits /> },
        { path: 'settings', element: <AdminSetting /> },
        { path: 'tickets', element: <TicketList /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
