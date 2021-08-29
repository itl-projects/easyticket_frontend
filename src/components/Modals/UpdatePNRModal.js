import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Grid } from '@material-ui/core';
import { useAdminContext } from '../../context/AdminContext';
import UpdatePNRForm from '../Forms/UpdatePNRForm';
import SingleBookingDetailTable from '../_adminDashboard/Bookings/SingleBookingDetailTable';

export default function UpdatePNRModal() {
  const adminContext = useAdminContext();
  const { showUpdatePNRModal, toggleShowUpdatePNRModal } = adminContext;

  return (
    <Dialog
      onClose={() => toggleShowUpdatePNRModal(null)}
      open={showUpdatePNRModal !== null}
      maxWidth="lg"
      fullWidth
    >
      <MuiDialogTitle onClose={() => toggleShowUpdatePNRModal(null)}>UPDATE PNR</MuiDialogTitle>
      <MuiDialogContent dividers>
        <UpdatePNRForm
          bookingId={showUpdatePNRModal?.id}
          ticketId={showUpdatePNRModal?.ticket.id}
          closeModal={() => toggleShowUpdatePNRModal(null)}
        />
        <Grid item sx={{ mt: 2 }}>
          <SingleBookingDetailTable passengers={showUpdatePNRModal?.passengers} />
        </Grid>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="error" variant="outlined" onClick={() => toggleShowUpdatePNRModal(null)}>
          Close
        </Button>
      </MuiDialogActions>
    </Dialog>
  );
}
