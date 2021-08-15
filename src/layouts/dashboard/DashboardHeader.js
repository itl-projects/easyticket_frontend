import { useState, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { styled, alpha } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Grid,
  Stack,
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
            label: 'Home',
            icon: homeFill,
            linkTo: '/dashboard'
          },
          {
            label: 'Settings',
            icon: settings2Fill,
            linkTo: '/dashboard/settings'
          }
        ];
      case USER_ROLES.USER:
        return [
          {
            label: 'Home',
            icon: homeFill,
            linkTo: '/dashboard'
          },
          {
            label: 'My Bookings',
            icon: personFill,
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
        <Stack dir="column" display="flex" width="100%">
          <Grid
            sx={{
              width: '100%',
              backgroundColor: '#daf1fe',
              height: 32,
              px: 2,
              color: '#000',
              marginLeft: 0,
              paddingTop: 0
            }}
            display="flex"
            alignItems="center"
            flexWrap="wrap"
          >
            <Grid item xs={8} lg={4} justifyContent="center" alignItems="center">
              <Typography variant="body2">
                +91-12344-666-777 &nbsp; | &nbsp; +91-00-00-00-00
              </Typography>
            </Grid>
            <Grid xs={4} lg={8} item>
              <Grid display="flex" justifyContent="flex-end" columnGap={2}>
                <Typography variant="body2">Contact</Typography>
                <Button
                  onClick={() => setLogoutDialog(true)}
                  variant="text"
                  sx={{ p: 0, color: '#000' }}
                >
                  <Typography variant="body2">logout</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            sx={{
              width: '100%',
              marginTop: 0,
              boxShadow: '0px 3px 2px 0px #0000001a',
              marginLeft: 0,
              py: 1,
              paddingRight: 2
            }}
            container
            alignItems="center"
            // spacing={2}
            flexWrap="wrap"
          >
            <Grid item xs={2} sx={{ pt: 0 }}>
              <DrawerLogo />
            </Grid>
            <Grid item xs={10} lg={10} sx={{ pt: 0 }}>
              <Grid display="flex" justifyContent="flex-end" columnGap={2}>
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
                      component={RouterLink}
                      onClick={2}
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
                </MenuPopover>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
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
