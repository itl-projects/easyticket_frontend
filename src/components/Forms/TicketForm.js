import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  TextField,
  IconButton,
  InputAdornment,
  Grid,
  FormControlLabel,
  Switch,
  Button
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import flightIcon from '@iconify/icons-ic/baseline-flight';
// import flightTackoffIcon from '@iconify/icons-ic/baseline-flight-takeoff';
// import flightLandIcon from '@iconify/icons-ic/baseline-flight-land';
import ticketIcon from '@iconify/icons-ic/baseline-airplane-ticket';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDateTimePicker } from '@material-ui/lab';
import { formatISO } from 'date-fns';
import enLocale from 'date-fns/locale/en-IN';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AirportAutocomplete from '../FormComponents/AirportAutocomplete';
import AirlineAutocomplete from '../FormComponents/AirlineAutocomplete';
import { ticketsAPI } from '../../services/admin';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
// ----------------------------------------------------------------------

TicketForm.propTypes = {
  submitRef: PropTypes.func,
  closeModal: PropTypes.func
};

export default function TicketForm({ submitRef, closeModal }) {
  const ticketAddSchema = Yup.object().shape({
    departureDateTime: Yup.date().required('Departure datetime is required'),
    arrivalDateTime: Yup.date().required('Arrival datetime is required'),
    source: Yup.number().required('Source is required'),
    destination: Yup.number()
      .notOneOf([Yup.ref('source'), null], 'Source and destination cannot be same')
      .required('Destination is required'),
    airline: Yup.string().required('Airline is required'),
    flightNumber: Yup.string().required('Flight number is required'),
    price: Yup.number()
      .typeError('Please enter only numbers')
      .positive()
      .min(1)
      .required('Ticket price is required'),
    quantity: Yup.number()
      .typeError('Please enter only numbers')
      .positive()
      .min(1)
      .required('Ticket quantity is required'),
    isRefundable: Yup.boolean(),
    isHotDeal: Yup.boolean()
  });

  const formik = useFormik({
    initialValues: {
      departureDateTime: formatISO(new Date()),
      arrivalDateTime: formatISO(new Date()),
      source: '',
      destination: '',
      airline: '',
      flightNumber: '',
      price: '',
      quantity: '1',
      isRefundable: false,
      isHotDeal: true
    },
    validationSchema: ticketAddSchema,
    onSubmit: async () => {
      setSubmitting(true);
      const res = await ticketsAPI.addTicket(values);
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

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    setSubmitting
  } = formik;
  const [value, setValue] = useState(new Date());
  const [value2, setValue2] = useState(new Date());

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
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          mb={3}
          mt={0}
          px={12}
        >
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
              <DesktopDateTimePicker
                label="Departure DateTime"
                ampm={false}
                minDate={new Date()}
                ampmInClock={false}
                value={value}
                onChange={(newValue) => {
                  setFieldValue('departureDateTime', formatISO(newValue));
                  setValue(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(touched.departureDateTime && errors.departureDateTime)}
                    helperText={touched.departureDateTime && errors.departureDateTime}
                    size="small"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
              <DesktopDateTimePicker
                label="Arrival DateTime"
                value={value2}
                ampm={false}
                minDate={value}
                ampmInClock={false}
                onChange={(newValue) => {
                  setFieldValue('arrivalDateTime', formatISO(newValue));
                  setValue2(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={Boolean(touched.arrivalDateTime && errors.arrivalDateTime)}
                    helperText={touched.arrivalDateTime && errors.arrivalDateTime}
                    size="small"
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <AirportAutocomplete
              label="Source"
              value={values.source}
              onChange={(v) => setFieldValue('source', v)}
              error={Boolean(touched.source && errors.source)}
              helperText={touched.source && errors.source}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <AirportAutocomplete
              label="Destination"
              value={values.destination}
              onChange={(v) => setFieldValue('destination', v)}
              error={Boolean(touched.destination && errors.destination)}
              helperText={touched.destination && errors.destination}
              size="small"
            />
          </Grid>

          <Grid item xs={6}>
            <AirlineAutocomplete
              label="Airline"
              value={values.airline}
              onChange={(v) => setFieldValue('airline', v)}
              error={Boolean(touched.airline && errors.airline)}
              helperText={touched.airline && errors.airline}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Flight Number"
              {...getFieldProps('flightNumber')}
              error={Boolean(touched.flightNumber && errors.flightNumber)}
              helperText={touched.flightNumber && errors.flightNumber}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={flightIcon} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Price"
              {...getFieldProps('price')}
              error={Boolean(touched.price && errors.price)}
              helperText={touched.price && errors.price}
              InputProps={{
                endAdornment: <InputAdornment position="end">$</InputAdornment>
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="text"
              label="Quantity"
              {...getFieldProps('quantity')}
              error={Boolean(touched.quantity && errors.quantity)}
              helperText={touched.quantity && errors.quantity}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <Icon icon={ticketIcon} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={values.isRefundable} />}
              label="Is Refundable?"
              {...getFieldProps('isRefundable')}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={values.isHotDeal} />}
              label="Is Hot Deal?"
              {...getFieldProps('isHotDeal')}
            />
          </Grid>
        </Grid>
        <Button hidden ref={submitRef} type="submit" />
      </Form>
    </FormikProvider>
  );
}
