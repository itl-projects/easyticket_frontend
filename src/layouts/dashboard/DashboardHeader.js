import { useState, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
// import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import logoutIcon from '@iconify/icons-eva/power-fill';
import listFill from '@iconify-icons/tabler/list-check';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
// material
import { styled, alpha } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  Box
} from '@material-ui/core';
// components
import { DrawerLogo } from '../../components/Logos';
import { removeUserData } from '../../store/actions/authAction';
import { useAuth } from '../../context/AuthContext';
// components
import MenuPopover from '../../components/MenuPopover';
import { USER_ROLES } from '../../utils/constants';
// ----------------------------------------------------------------------
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72)
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP
  },
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  marginLeft: '0 !important',
  alignItems: 'flex-start !important'
}));

export default function DashboardHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useAuth();

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  const logoutUser = () => {
    dispatch(removeUserData());
    navigate('/', { replace: true });
  };

  const MENU_OPTIONS = useMemo(() => {
    if (!auth.user) return [];
    switch (auth.user.role) {
      case USER_ROLES.ADMIN:
        return [
          {
            label: 'Settings',
            icon: settings2Fill,
            linkTo: '/dashboard/settings'
          }
        ];
      case USER_ROLES.USER:
        return [
          {
            label: 'My Bookings',
            icon: listFill,
            linkTo: '/dashboard/bookedtickets'
          }
        ];
      default:
        return [];
    }
  }, [auth]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <Grid
          sx={{
            width: '100%',
            marginTop: 0,
            boxShadow: '0px 3px 2px 0px #0000001a',
            marginLeft: 0,
            py: 1,
            paddingRight: 2,
            paddingBottom: 1.5
          }}
          container
          alignItems="center"
          // spacing={2}
          flexWrap="wrap"
        >
          <Grid
            item
            xs={4}
            md={3}
            lg={2}
            sx={{ pt: 0, pl: 2 }}
            display="flex"
            justifyContent="flex-start"
          >
            <RouterLink to="/dashboard">
              <DrawerLogo />
            </RouterLink>
          </Grid>
          <Grid item xs={8} md={9} lg={10} sx={{ pt: 0 }}>
            <Grid display="flex" justifyContent="flex-end" columnGap={2} alignItems="center">
              {auth && auth.user.role !== 2 && (
                <Typography color="black">
                  Welcome {auth?.user.profile?.company} :: {auth?.user.username}
                </Typography>
              )}
              <Button
                ref={anchorRef}
                onClick={handleOpen}
                variant="contained"
                color="inherit"
                disableElevation
              >
                My Account
              </Button>
              <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{ width: 220 }}
              >
                {MENU_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.label}
                    to={option.linkTo}
                    component={NavLink}
                    sx={{ typography: 'body2', py: 1, px: 2.5 }}
                  >
                    <Box
                      component={Icon}
                      icon={option.icon}
                      sx={{
                        mr: 2,
                        width: 24,
                        height: 24
                      }}
                    />
                    {option.label}
                  </MenuItem>
                ))}
                <MenuItem
                  component={Button}
                  sx={{ typography: 'body2', py: 1, px: 2.5 }}
                  onClick={() => setLogoutDialog(true)}
                  fullWidth
                >
                  <Box
                    component={Icon}
                    icon={logoutIcon}
                    sx={{
                      mr: 2,
                      width: 24,
                      height: 24
                    }}
                  />
                  Logout
                </MenuItem>
              </MenuPopover>
            </Grid>
          </Grid>
        </Grid>
      </ToolbarStyle>
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        maxWidth="sm"
        fullWidth
        id="header-logout"
      >
        <DialogTitle id="alert-dialog-title">Are you sure </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to logout ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)} color="primary">
            NO
          </Button>
          <Button onClick={logoutUser} color="error" autoFocus>
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </RootStyle>
  );
}
