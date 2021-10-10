import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material

import { useAdminContext } from '../../context/AdminContext';
import { removeUserData } from '../../store/actions/authAction';

export default function GlobalLogoutAlertModal() {
  const adminContext = useAdminContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showGlobalLogoutModal, toggleShowGlobalLogoutModal } = adminContext;

  const logoutUser = () => {
    dispatch(removeUserData());
    toggleShowGlobalLogoutModal(false);
    navigate('/', { replace: true });
  };

  return (
    <Dialog onClose={logoutUser} open={!!showGlobalLogoutModal} maxWidth="sm" fullWidth>
      <MuiDialogTitle onClose={logoutUser}>{showGlobalLogoutModal}</MuiDialogTitle>
      <MuiDialogActions>
        <Button color="success" variant="outlined" onClick={logoutUser}>
          Ok, Logout
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
}
