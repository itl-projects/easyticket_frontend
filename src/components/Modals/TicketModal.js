import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useAdminContext } from '../../context/AdminContext';
import TicketForm from '../Forms/TicketForm';

export default function TicketModalModal() {
  const adminContext = useAdminContext();
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
          {showTicketModal !== null ? 'Edit Ticket' : 'Create Ticket'}
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <TicketForm submitRef={submitRef} closeModal={toggleShowTicketModal} />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button color="error" variant="outlined" onClick={toggleShowTicketModal}>
            cancel
          </Button>
          <Button onClick={submitForm} color="primary" variant="outlined">
            create ticket
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
}
