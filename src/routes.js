import { Navigate, useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

// common
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
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
import TicketSearch from './pages/Dashboard/Agent/TicketSearch';
import ConfirmBooking from './pages/Dashboard/Agent/ConfirmBooking';
import BookingDetail from './pages/Dashboard/Agent/BookingDetail';
import BookedTickets from './pages/Dashboard/Agent/BookedTickets';
import DepositeRequests from './pages/Dashboard/Agent/DepositeRequests';
import BookingSuccess from './pages/Dashboard/Agent/BookingSuccess';
import BookingFailed from './pages/Dashboard/Agent/BookingFailed';
import AgentProfile from './pages/Dashboard/Agent/Profile';

// supplier
import SupplierDashboard from './pages/Dashboard/Supplier';
import SupplierTickets from './pages/Dashboard/Supplier/TicketList';
import SupplierCredits from './pages/Dashboard/Supplier/Credits';
import SupplierProfile from './pages/Dashboard/Supplier/Profile';

import { USER_ROLES } from './utils/constants';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuth();

  const getDashboard = () => {
    switch (user && user.role) {
      case USER_ROLES.ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.USER:
        return <AgentDashboard />;
      case USER_ROLES.SUPPLIER:
        return <Navigate to="/dashboard/bookings" replace />;
      default:
        return null;
    }
  };

  return useRoutes([
    {
      path: '',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'registration-success', element: <RegistrationSuccess /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/login" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    user
      ? {
          path: '/dashboard',
          element: <DashboardLayout />,
          children: [
            { path: '', element: getDashboard() },
            // user.role === USER_ROLES.SUPPLIER && { path: '', element: <AdminDashboard /> },
            // Admin Routes
            user.role === USER_ROLES.ADMIN && { path: 'agents', element: <UsersListPage /> },
            user.role === USER_ROLES.ADMIN && { path: 'bookings', element: <BookingsPage /> },
            user.role === USER_ROLES.SUPPLIER && {
              path: 'bookings',
              element: <SupplierDashboard />
            },
            user.role === USER_ROLES.ADMIN && { path: 'credits', element: <Credits /> },
            user.role === USER_ROLES.SUPPLIER && { path: 'credits', element: <SupplierCredits /> },
            user.role === USER_ROLES.ADMIN && { path: 'settings', element: <AdminSetting /> },
            user.role === USER_ROLES.ADMIN && { path: 'tickets', element: <TicketList /> },
            user.role === USER_ROLES.SUPPLIER && { path: 'tickets', element: <SupplierTickets /> },
            user.role === USER_ROLES.USER && {
              path: '/confirmBooking',
              element: <ConfirmBooking />
            },
            user.role === USER_ROLES.USER && {
              path: '/deposite-requests',
              element: <DepositeRequests />
            },
            user.role === USER_ROLES.USER && {
              path: '/bookingdetail',
              element: <BookingDetail />
            },
            user.role === USER_ROLES.USER && {
              path: '/bookedtickets',
              element: <BookedTickets />
            },
            user.role === USER_ROLES.USER && {
              path: '/bookingsuccess',
              element: <BookingSuccess />
            },
            user.role === USER_ROLES.USER && {
              path: '/bookingfailed',
              element: <BookingFailed />
            },
            user.role === USER_ROLES.USER && {
              path: '/searchTicket',
              element: <TicketSearch />
            },
            user.role === USER_ROLES.USER && { path: '/profile', element: <AgentProfile /> },
            user.role === USER_ROLES.SUPPLIER && { path: '/profile', element: <SupplierProfile /> }
          ]
        }
      : { path: '*', element: <Navigate to="/login" replace /> }
  ]);
}
