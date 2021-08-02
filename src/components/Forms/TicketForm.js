import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  TextField,
  IconButton,
  InputAdornment,
  Grid,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import flightIcon from '@iconify/icons-ic/baseline-flight';
import flightTackoffIcon from '@iconify/icons-ic/baseline-flight-takeoff';
import flightLandIcon from '@iconify/icons-ic/baseline-flight-land';
import ticketIcon from '@iconify/icons-ic/baseline-airplane-ticket';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
// ----------------------------------------------------------------------

export default function TicketForm() {
  const userAddSchema = Yup.object().shape({
    userType: Yup.string().required('userType is required'),
    commision: Yup.string(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    companyName: Yup.string().required('Agency/Company name is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    panNumber: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      userType: '',
      commision: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      companyName: '',
      state: '',
      city: '',
      panNumber: ''
    },
    validationSchema: userAddSchema,
    onSubmit: () => {}
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Travel Date"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="From"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={flightTackoffIcon} />
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
              label="To"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={flightLandIcon} />
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
              label="Airline"
              {...getFieldProps('phone')}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={flightIcon} />
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
              label="Flight Number"
              {...getFieldProps('companyName')}
              error={Boolean(touched.companyName && errors.companyName)}
              helperText={touched.companyName && errors.companyName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={flightIcon} />
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
              label="Price"
              {...getFieldProps('state')}
              error={Boolean(touched.state && errors.state)}
              helperText={touched.state && errors.state}
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Quantity"
              {...getFieldProps('city')}
              error={Boolean(touched.city && errors.city)}
              helperText={touched.city && errors.city}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={ticketIcon} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch />} label="Is Refundable?" />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch />} label="Is Hot Deal?" />
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
