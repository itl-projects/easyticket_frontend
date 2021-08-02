import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useAdminContext } from '../../context/AdminContext';
import UserForm from '../Forms/UserForm';

export default function AddAgentModal() {
  const adminContext = useAdminContext();
  const { showAgentModal, toggleShowAgentModal } = adminContext;
  const [submitRef, SetSubmitRef] = useState(false);

  const submitForm = () => {
    SetSubmitRef(true);
    setTimeout(() => {
      SetSubmitRef(false);
    }, 0);

    return () => SetSubmitRef(false);
  };

  return (
    <div>
      <Dialog
        onClose={toggleShowAgentModal}
        aria-labelledby="customized-dialog-title"
        open={showAgentModal}
        maxWidth="md"
        fullWidth
      >
        <MuiDialogTitle id="customized-dialog-title" onClose={toggleShowAgentModal}>
          Create User
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <UserForm submitRef={submitRef} closeModal={toggleShowAgentModal} />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button color="error" variant="outlined" onClick={toggleShowAgentModal}>
            cancel
          </Button>
          <Button onClick={submitForm} color="primary" variant="outlined">
            create user
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
}
