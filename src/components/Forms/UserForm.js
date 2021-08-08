import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { TextField, IconButton, InputAdornment, MenuItem, Grid } from '@material-ui/core';
import { Icon } from '@iconify/react';
import commisionIcon from '@iconify/icons-ic/baseline-emoji-events';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { USER_TYPES } from '../../utils/constants';
import { usersAPI } from '../../services/admin';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
// ----------------------------------------------------------------------

UserForm.propTypes = {
  submitRef: PropTypes.any,
  closeModal: PropTypes.func
};

export default function UserForm({ submitRef, closeModal }) {
  const userAddSchema = Yup.object().shape({
    role: Yup.string().required('User Type is required'),
    commision: Yup.string(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    company: Yup.string().required('Agency/Company name is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    pan: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      role: '',
      commision: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      state: '',
      city: '',
      pan: ''
    },
    validationSchema: userAddSchema,
    onSubmit: async () => {
      setSubmitting(true);
      const res = await usersAPI.addUser(values);
      setSubmitting(false);
      if (res && res.status === 201) {
        successMessage(res.data.message);
        closeModal(true);
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
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } =
    formik;

  useEffect(() => {
    if (submitRef) handleSubmit();
  }, [submitRef, handleSubmit]);

  return (
    <FormikProvider value={formik}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
        onClick={() => setSubmitting(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} px={8}>
          <Grid item xs={6}>
            <TextField
              label="Type of User"
              select
              {...getFieldProps('role')}
              fullWidth
              error={Boolean(touched.role && errors.role)}
              helperText={touched.role && errors.role}
            >
              {USER_TYPES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Commision (Only for supplier)"
              {...getFieldProps('commision')}
              error={Boolean(touched.commision && errors.commision)}
              helperText={touched.commision && errors.commision}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={commisionIcon} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="First Name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Last Name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Phone Number"
              {...getFieldProps('phone')}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Agency/Company Name"
              {...getFieldProps('company')}
              error={Boolean(touched.company && errors.company)}
              helperText={touched.company && errors.company}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="State"
              {...getFieldProps('state')}
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state && errors.state}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="City"
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Pan Number (Optional)"
              {...getFieldProps('pan')}
              error={Boolean(touched.pan && errors.pan)}
              helperText={touched.pan && errors.pan}
            />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
