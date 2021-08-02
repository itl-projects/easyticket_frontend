import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useAdminContext } from '../../context/AdminContext';
import FundTransferForm from '../Forms/FundTransferForm';

export default function TicketModalModal() {
  const adminContext = useAdminContext();
  const { showFundTransferModal, toggleShowFundTransferModal } = adminContext;

  return (
    <div>
      <Dialog
        onClose={toggleShowFundTransferModal}
        aria-labelledby="customized-dialog-title"
        open={showFundTransferModal}
        maxWidth="sm"
        fullWidth
      >
        <MuiDialogTitle id="customized-dialog-title" onClose={toggleShowFundTransferModal}>
          Fund Transfer
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <FundTransferForm />
        </MuiDialogContent>
        <MuiDialogActions>
          <Button color="error" variant="outlined" onClick={toggleShowFundTransferModal}>
            cancel
          </Button>
          <Button onClick={toggleShowFundTransferModal} color="primary" variant="outlined">
            Transfer Fund
          </Button>
        </MuiDialogActions>
      </Dialog>
    </div>
  );
}
