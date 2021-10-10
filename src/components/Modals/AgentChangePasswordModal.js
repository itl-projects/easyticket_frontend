import * as Yup from 'yup';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { TextField, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { profileAPI } from '../../services/agent';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
import { useAdminContext } from '../../context/AdminContext';

AgentChangePasswordModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default function AgentChangePasswordModal({ show, onClose }) {
  const adminContext = useAdminContext();
  const { toggleShowGlobalLogoutModal } = adminContext;

  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .max(50, 'Maximum 50 symbols')
      .required('Please enter new password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm password')
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: changePasswordSchema,
    onSubmit: async () => {
      try {
        setSubmitting(true);
        const res = await profileAPI.changePassword(values);
        setSubmitting(false);
        if (res && res.status === 201) {
          successMessage(res.data.message);
          onClose();
          toggleShowGlobalLogoutModal(
            'Password Changed! Please logout abd login again to apply changes'
          );
          return;
        }
        if (res && res.data) {
          if (res.data && res.status === 400) {
            if (typeof res.data.message === 'object' && res.data.message.length > 0) {
              res.data.message.forEach((el) => {
                warningMessage(el);
              });
              return;
            }
            warningMessage(res.data.message);
            return;
          }
        }
        errorMessage('Something went wrong. Try later.');
      } catch (err) {
        setSubmitting(false);
        errorMessage('Something went wrong. Try later.');
      }
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    submitForm,
    setSubmitting
  } = formik;

  return (
    <Dialog onClose={onClose} open={show} maxWidth="sm" fullWidth>
      <MuiDialogTitle onClose={onClose}>Password Change Form</MuiDialogTitle>
      <MuiDialogContent dividers>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              mb={3}
              mt={0}
              px={12}
            >
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, pl: 1 }}>Old Password</Typography>
                <TextField
                  size="small"
                  fullWidth
                  type="password"
                  placeholder="Old Password"
                  {...getFieldProps('oldPassword')}
                  error={Boolean(touched.oldPassword && errors.oldPassword)}
                  helperText={touched.oldPassword && errors.oldPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, pl: 1 }}>New Password</Typography>
                <TextField
                  size="small"
                  fullWidth
                  type="password"
                  placeholder="New Password"
                  {...getFieldProps('newPassword')}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, pl: 1 }}>Confirm New Password</Typography>
                <TextField
                  size="small"
                  fullWidth
                  type="password"
                  placeholder="confirm password"
                  {...getFieldProps('confirmPassword')}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button color="error" variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={isSubmitting}
          color="success"
          variant="outlined"
          onClick={submitForm}
        >
          Change Password
        </LoadingButton>
      </MuiDialogActions>
    </Dialog>
  );
}
