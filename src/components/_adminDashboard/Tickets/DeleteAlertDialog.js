import {
  Dialog,
  DialogContent,
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import PropTypes from 'prop-types';

DeleteAlertDialog.propTypes = {
  open: PropTypes.bool,
  onResponse: PropTypes.func
};
export default function DeleteAlertDialog({ open, onResponse }) {
  return (
    <Dialog
      open={open}
      onClose={() => onResponse(false)}
      maxWidth="sm"
      fullWidth
      id="header-logout"
    >
      <DialogTitle id="alert-dialog-title">Are you sure </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">Do you want to remove?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onResponse(false)} color="primary">
          NO
        </Button>
        <Button onClick={() => onResponse(true)} color="error" autoFocus>
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}
