import * as Yup from 'yup';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  // Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Alert
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { setUserData } from '../../../store/actions/authAction';
import { loginUser } from '../../../services/auth';
import { successMessage } from '../../../utils/helperFunctions';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Invalid Login credentials !');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email/Phone is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      const res = await loginUser({ email: values.email, password: values.password });
      setSubmitting(false);
      if (res && res.status === 201) {
        if (res.data && res.data.success) {
          dispatch(setUserData(res.data));
          successMessage('Logged in Successfully ');
          return;
        }
        setErrorMessage(res.data.message);
        setLoginError(true);
        return;
      }
      setErrorMessage('Invalid Login credentials !');
      setLoginError(true);
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setSubmitting } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {loginError && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Enter email/phone"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          {/* <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
