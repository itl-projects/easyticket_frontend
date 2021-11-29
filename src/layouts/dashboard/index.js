import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// material
import { Stack } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

//
import AlertInfoDialog from '../../components/dialogs/AlertInfoDialog';
// import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import AdminProvider from '../../context/AdminContext';
import DrawerHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import GlobalLogoutAlertModal from '../../components/Modals/GlobalLogoutAlertModal';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 92;
const APP_BAR_DESKTOP = 92;

const DashboardBody = styled('div')({
  display: 'flex',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '95.5vh',
  paddingTop: APP_BAR_MOBILE + 12,
  // paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 12
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  if (user) {
    return (
      <Stack justifyContent="space-between">
        <DashboardBody>
          <DrawerHeader />
          {/* <DashboardNavbar onOpenSidebar={() => setOpen(true)} /> */}
          {user.role !== 1 && (
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          )}
          <AdminProvider>
            <MainStyle>
              <Outlet />
            </MainStyle>
            <GlobalLogoutAlertModal />
            <AlertInfoDialog />
          </AdminProvider>
        </DashboardBody>
        {user.role !== 2 && <DashboardFooter />}
      </Stack>
    );
  }
  return <Navigate to="/login" replace />;
}
