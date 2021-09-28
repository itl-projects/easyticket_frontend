import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import LoadingButton from '@material-ui/lab/LoadingButton';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { format } from 'date-fns';
import { useAdminContext } from '../../context/AdminContext';
import { formatPrice, successMessage, errorMessage } from '../../utils/helperFunctions';
import { creditRequestAPI } from '../../services/admin';

export default function CreditApproveModal() {
  const adminContext = useAdminContext();
  const { showCreditApproveModal, toggleShowCreditApproveModal } = adminContext;
  const [loading, setLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const sendApproveRequest = async () => {
    setLoading(true);
    const res = await creditRequestAPI.approveCreditRequest(showCreditApproveModal.id);
    setLoading(false);
    if (res && res.data) {
      if (res.data.success) {
        successMessage(res.data.message);
        toggleShowCreditApproveModal(null);
      } else {
        errorMessage(res.data.message);
      }
    } else {
      errorMessage('Sorry! something went wrong');
    }
  };

  const sendDeclineRequest = async () => {
    setDeclineLoading(true);
    const res = await creditRequestAPI.declineCreditRequest(showCreditApproveModal.id);
    setDeclineLoading(false);
    if (res && res.data) {
      if (res.data.success) {
        successMessage(res.data.message);
        toggleShowCreditApproveModal(null);
      } else {
        errorMessage(res.data.message);
      }
    } else {
      errorMessage('Sorry! something went wrong');
    }
  };

  return (
    <Dialog
      onClose={() => toggleShowCreditApproveModal(null)}
      open={showCreditApproveModal !== null}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <MuiDialogTitle onClose={() => toggleShowCreditApproveModal(null)}>
        Approve Credit Request
      </MuiDialogTitle>
      <MuiDialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
        {showCreditApproveModal && (
          <Card sx={{ p: 2, width: '80%', overflowY: 'auto' }}>
            <Grid container>
              <Grid item xs={12} md={6} sx={{ px: 4 }}>
                <Typography variant="subtitle1" textAlign="right">
                  Agent Ref
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>{showCreditApproveModal.agent.username}</Typography>
              </Grid>
              <Grid xs={12} sx={{ py: 2 }}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} sx={{ px: 4 }}>
                <Typography variant="subtitle1" textAlign="right">
                  Agency name
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>{showCreditApproveModal.agent.profile.company}</Typography>
              </Grid>
              <Grid xs={12} sx={{ py: 2 }}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} sx={{ px: 4 }}>
                <Typography variant="subtitle1" textAlign="right">
                  Requested Amount
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>₹{formatPrice(showCreditApproveModal.amount)}</Typography>
              </Grid>
              <Grid xs={12} sx={{ py: 2 }}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} sx={{ px: 4 }}>
                <Typography variant="subtitle1" textAlign="right">
                  Requested On
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  {format(new Date(showCreditApproveModal.requestDate), 'dd-MM-yyyy HH:mm')}
                </Typography>
              </Grid>
              <Grid xs={12} sx={{ py: 2 }}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} sx={{ px: 4 }}>
                <Typography variant="subtitle1" textAlign="right">
                  Remark
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>{showCreditApproveModal.remark}</Typography>
              </Grid>
            </Grid>
          </Card>
        )}
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="error" variant="outlined" onClick={() => toggleShowCreditApproveModal(null)}>
          Cancel
        </Button>
        <LoadingButton
          loading={declineLoading}
          color="warning"
          variant="outlined"
          onClick={sendDeclineRequest}
        >
          Decline
        </LoadingButton>
        <LoadingButton
          loading={loading}
          color="success"
          variant="outlined"
          onClick={sendApproveRequest}
        >
          Apporve
        </LoadingButton>
      </MuiDialogActions>
    </Dialog>
  );
}
