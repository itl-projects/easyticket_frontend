import {
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import { useAdminContext } from '../../context/AdminContext';

export default function AlertInfoDialog() {
  const adminContext = useAdminContext();
  const { showAlertInfo, setShowAlertInfo } = adminContext;

  return (
    <Dialog
      open={showAlertInfo}
      onClose={() => setShowAlertInfo(false)}
      maxWidth="sm"
      fullWidth
      id="header-logout"
    >
      <DialogTitle id="alert-dialog-title">{showAlertInfo?.title || 'Info'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {showAlertInfo?.message || ''}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAlertInfo(false)} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
