import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// common
import Login from './pages/Login';
import NotFound from './pages/Page404';

// Admin dashboard pages
import AdminDashboard from './pages/Dashboard/SuperAdmin';
import UsersListPage from './pages/Dashboard/SuperAdmin/UsersListPage';
import BookingsPage from './pages/Dashboard/SuperAdmin/BookingsPage';
import Credits from './pages/Dashboard/SuperAdmin/Credits';
import TicketList from './pages/Dashboard/SuperAdmin/TicketList';
import AdminSetting from './pages/Dashboard/SuperAdmin/Setting';

// Agent dashboard pages
import AgentDashboard from './pages/Dashboard/Agent';
import ConfirmBooking from './pages/Dashboard/Agent/ConfirmBooking';
import BookingDetail from './pages/Dashboard/Agent/BookingDetail';
import BookedTickets from './pages/Dashboard/Agent/BookedTickets';
import BookingSuccess from './pages/Dashboard/Agent/BookingSuccess';
import BookingFailed from './pages/Dashboard/Agent/BookingFailed';

import { USER_ROLES } from './utils/constants';

// ----------------------------------------------------------------------

export default function Router() {
  const auth = useAuth();

  const getDashboard = () => {
    switch (auth.user.role) {
      case USER_ROLES.ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.USER:
        return <AgentDashboard />;
      default:
        return null;
    }
  };

  return useRoutes([
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    auth.user
      ? {
          path: '/dashboard',
          element: <DashboardLayout />,
          children: [
            { path: '', element: getDashboard() },
            // user.role === USER_ROLES.SUPPLIER && { path: '', element: <AdminDashboard /> },
            // Admin Routes
            auth.user.role === USER_ROLES.ADMIN && { path: 'agents', element: <UsersListPage /> },
            auth.user.role === USER_ROLES.ADMIN && { path: 'bookings', element: <BookingsPage /> },
            auth.user.role === USER_ROLES.ADMIN && { path: 'credits', element: <Credits /> },
            auth.user.role === USER_ROLES.ADMIN && { path: 'settings', element: <AdminSetting /> },
            auth.user.role === USER_ROLES.ADMIN && { path: 'tickets', element: <TicketList /> },
            { path: '/confirmBooking', element: <ConfirmBooking /> },
            { path: '/bookingdetail', element: <BookingDetail /> },
            { path: '/bookedtickets', element: <BookedTickets /> },
            { path: '/bookingsuccess', element: <BookingSuccess /> },
            { path: '/bookingfailed', element: <BookingFailed /> }
          ]
        }
      : {}
  ]);
}
