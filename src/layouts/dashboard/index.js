import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// material
import { Stack } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
//
// import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import AdminProvider from '../../context/AdminContext';
import DrawerHeader from './DashboardHeader';

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
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 12,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 12
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  if (auth.user) {
    return (
      <Stack>
        <DashboardBody>
          <DrawerHeader />
          {/* <DashboardNavbar onOpenSidebar={() => setOpen(true)} /> */}
          {auth.user.role === 2 && (
            <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          )}
          <AdminProvider>
            <MainStyle>
              <Outlet />
            </MainStyle>
          </AdminProvider>
        </DashboardBody>
      </Stack>
    );
  }

  return <Navigate to={{ pathname: '/login' }} />;
}
