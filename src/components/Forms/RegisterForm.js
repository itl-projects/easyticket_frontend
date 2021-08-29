import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { TextField, InputAdornment, Grid, IconButton } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// import commisionIcon from '@iconify/icons-ic/baseline-emoji-events';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import { USER_TYPES } from '../../utils/constants';
import { registerUser } from '../../services/auth';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
import { setRegistrationStatus } from '../../store/actions/globalAction';
// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userAddSchema = Yup.object().shape({
    // role: Yup.string().required('User Type is required'),
    // commision: Yup.string(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    company: Yup.string().required('Agency/Company name is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required')
    // pan: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      // role: '',
      // commision: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      confirmPassword: '',
      password: '',
      company: '',
      state: '',
      city: ''
      // pan: ''
    },
    validationSchema: userAddSchema,
    onSubmit: async () => {
      setSubmitting(true);
      const data = {
        ...values,
        phone: String(values.phone)
      };
      const res = await registerUser(data);
      setSubmitting(false);
      if (res && res.status === 201) {
        successMessage(res.data.message);
        registrationSuccess(true);
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

  const registrationSuccess = (status) => {
    dispatch(setRegistrationStatus(status));
    setTimeout(() => {
      navigate('/registration-success', { replace: true });
    }, 200);
  };

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
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* <Grid item xs={6}>
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
          </Grid> */}
          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
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
          </Grid> */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder="First Name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder="Last Name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="email"
              placeholder="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              InputProps={{
                startAdornment: <InputAdornment position="start">@</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="Phone Number"
              {...getFieldProps('phone')}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              InputProps={{
                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confrim Password"
              {...getFieldProps('confirmPassword')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      <Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder="Agency/Company Name"
              {...getFieldProps('company')}
              error={Boolean(touched.company && errors.company)}
              helperText={touched.company && errors.company}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder="State"
              {...getFieldProps('state')}
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state && errors.state}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              placeholder="City"
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
            />
          </Grid>

          {/* <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="text"
              label="Pan Number (Optional)"
              {...getFieldProps('pan')}
              error={Boolean(touched.pan && errors.pan)}
              helperText={touched.pan && errors.pan}
            />
          </Grid> */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              sx={{ minWidth: 240 }}
            >
              Register
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
