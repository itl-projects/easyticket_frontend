import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Button
} from '@material-ui/core';
// components
import { DrawerLogo } from '../../components/Logos';
import { removeUserData } from '../../store/actions/authAction';
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

  const [logoutDialog, setLogoutDialog] = useState(false);

  const logoutUser = () => {
    dispatch(removeUserData());
    navigate('/', { replace: true });
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
                <Typography variant="body2">contact</Typography>
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
