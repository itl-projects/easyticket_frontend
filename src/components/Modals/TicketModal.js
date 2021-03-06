import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useAdminContext } from '../../context/AdminContext';
import TicketForm from '../Forms/TicketForm';
import SupplierTicketForm from '../Forms/SupplierTicketForm';
import { useAuth } from '../../context/AuthContext';

export default function TicketModalModal() {
  const adminContext = useAdminContext();
  const { user } = useAuth();
  const { showTicketModal, toggleShowTicketModal } = adminContext;
  const submitRef = useRef(null);

  const submitForm = () => {
    if (submitRef.current) {
      submitRef.current.click();
    }
  };

  return (
    <div>
      <Dialog
        onClose={toggleShowTicketModal}
        aria-labelledby="customized-dialog-title"
        open={showTicketModal !== null}
        maxWidth="md"
        fullWidth
      >
        <MuiDialogTitle id="customized-dialog-title" onClose={toggleShowTicketModal}>
          {showTicketModal !== null && Object.keys(showTicketModal).length
            ? 'Edit Ticket'
            : 'Create Ticket'}
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          {user.role === 3 && (
            <SupplierTicketForm submitRef={submitRef} closeModal={toggleShowTicketModal} />
          )}
          {user.role === 2 && (
            <TicketForm submitRef={submitRef} closeModal={toggleShowTicketModal} />
          )}
        </MuiDialogContent>
        <MuiDialogActions>
          <Button color="error" variant="outlined" onClick={toggleShowTicketModal}>
            cancel
          </Button>
          <Button onClick={submitForm} color="primary" variant="outlined">
            {showTicketModal !== null && Object.keys(showTicketModal).length
              ? 'Update Ticket'
              : 'Create Ticket'}
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
}
