import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import React, { useMemo, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useFormik, Form, FormikProvider } from 'formik';
import { styled, alpha } from '@material-ui/core/styles';
// material
import { TextField, Grid, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { profileAPI } from '../../services/agent';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
import { useAuth } from '../../context/AuthContext';
import { updateUserData } from '../../store/actions/authAction';

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  padding: theme.spacing(2, 2),
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  borderRadius: theme.shape.borderRadius,
  fontSize: theme.typography.fontSize,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.palette.divider,
  boderWidth: 2,
  width: '100%'
}));

AgentInfoEditForm.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default function AgentInfoEditForm({ show, onClose }) {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const changePasswordSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter first Name'),
    lastName: Yup.string().required('Please enter last name'),
    company: Yup.string().required('Please enter company name'),
    address: Yup.string()
  });

  const _initialValue = useMemo(() => {
    if (user.profile) {
      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.profile?.address || '',
        company: user.profile?.company || ''
      };
    }
    return {
      firstName: '',
      lastName: '',
      address: '',
      company: ''
    };
  }, [user]);

  const formik = useFormik({
    initialValues: _initialValue,
    validationSchema: changePasswordSchema,
    onSubmit: async () => {
      try {
        setSubmitting(true);
        const res = await profileAPI.updateProfileInfo(values);
        setSubmitting(false);
        if (res && res.status === 201) {
          successMessage(res.data.message);
          dispatch(
            updateUserData({
              ...user,
              firstName: values.firstName,
              lastName: values.lastName,
              profile: {
                ...user.profile,
                company: values.company,
                address: values.address
              }
            })
          );
          onClose();
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
    setSubmitting,
    resetForm
  } = formik;

  useEffect(() => {
    if (show) resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Dialog onClose={onClose} open={show} maxWidth="sm" fullWidth>
      <MuiDialogTitle onClose={onClose}>Profile Form</MuiDialogTitle>
      <MuiDialogContent dividers>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              mb={3}
              mt={0}
              px={8}
            >
              <Grid item xs={12}>
                <Grid container columnSpacing={{ xs: 0, md: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 1, pl: 1 }}>First Name</Typography>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      placeholder="first name"
                      {...getFieldProps('firstName')}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ mb: 1, pl: 1 }}>Last Name</Typography>
                    <TextField
                      size="small"
                      fullWidth
                      type="text"
                      placeholder="last name"
                      {...getFieldProps('lastName')}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, pl: 1 }}>Company Name</Typography>
                <TextField
                  size="small"
                  fullWidth
                  type="text"
                  placeholder="company name"
                  {...getFieldProps('company')}
                  error={Boolean(touched.company && errors.company)}
                  helperText={touched.company && errors.company}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, pl: 1 }}>Address</Typography>
                <TextArea
                  type="text"
                  size="small"
                  fullWidth
                  placeholder="address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                  minRows={3}
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
          Save
        </LoadingButton>
      </MuiDialogActions>
    </Dialog>
  );
}
