import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
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
import ticketIcon from '@iconify/icons-ic/baseline-airplane-ticket';
import { formatISO, addDays } from 'date-fns';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AirportAutocomplete from '../FormComponents/AirportAutocomplete';
import AirlineAutocomplete from '../FormComponents/AirlineAutocomplete';
import { ticketsAPI } from '../../services/admin';
import { useAdminContext } from '../../context/AdminContext';
import { successMessage, errorMessage, warningMessage } from '../../utils/helperFunctions';
import { DateTimeChooser } from '../core';
// ----------------------------------------------------------------------

TicketForm.propTypes = {
  submitRef: PropTypes.func,
  closeModal: PropTypes.func
};

export default function TicketForm({ submitRef, closeModal }) {
  const adminContext = useAdminContext();
  const { showTicketModal } = adminContext;

  const [value, setValue] = useState(new Date());
  const [value2, setValue2] = useState(new Date());

  const ticketAddSchema = Yup.object().shape({
    departureDateTime: Yup.date().required('Departure datetime is required'),
    arrivalDateTime: Yup.date().required('Arrival datetime is required'),
    source: Yup.number().required('Source is required'),
    destination: Yup.number()
      .notOneOf([Yup.ref('source'), null], 'Source and destination cannot be same')
      .required('Destination is required'),
    airline: Yup.string().required('Airline is required'),
    flightNumber: Yup.string().required('Flight number is required'),
    price: Yup.number().typeError('Please enter only numbers'),
    quantity: Yup.number()
      .typeError('Please enter only numbers')
      .required('Ticket quantity is required'),
    isRefundable: Yup.boolean(),
    isHotDeal: Yup.boolean(),
    note: Yup.string()
  });

  const _initialValues = useMemo(() => {
    if (showTicketModal !== null && Object.keys(showTicketModal).length) {
      setValue(new Date(showTicketModal.departureDateTime));
      setValue2(new Date(showTicketModal.arrivalDateTime));
      return {
        departureDateTime: showTicketModal.departureDateTime,
        arrivalDateTime: showTicketModal.arrivalDateTime,
        source: showTicketModal.source,
        destination: showTicketModal.destination,
        airline: showTicketModal.airline,
        flightNumber: showTicketModal.flightNumber,
        price: showTicketModal.price,
        quantity: showTicketModal.quantity,
        isRefundable: showTicketModal.isRefundable,
        isHotDeal: showTicketModal.isHotDeal,
        note: showTicketModal.note
      };
    }
    return {
      departureDateTime: formatISO(new Date()),
      arrivalDateTime: formatISO(new Date()),
      source: '',
      destination: '',
      airline: '',
      flightNumber: '',
      price: 0,
      quantity: 1,
      isRefundable: false,
      isHotDeal: true,
      note: '',
      createBulk: false,
      forDays: 1
    };
  }, [showTicketModal]);

  const formik = useFormik({
    initialValues: _initialValues,
    validationSchema: ticketAddSchema,
    onSubmit: async () => {
      setSubmitting(true);
      const data = {
        ...values,
        price: values.price || 0
      };
      delete data.createBulk;
      delete data.forDays;
      let res = null;
      if (showTicketModal !== null && Object.keys(showTicketModal).length)
        res = await ticketsAPI.updateTicket(showTicketModal.id, data);
      else if (values.createBulk) {
        const tickets = [];
        for (let i = 0; i < values.forDays; i += 1) {
          const info = {
            ...values,
            departureDateTime: addDays(new Date(values.departureDateTime), i),
            arrivalDateTime: addDays(new Date(values.arrivalDateTime), i),
            price: values.price || 0
          };
          delete info.createBulk;
          delete info.forDays;
          tickets.push(info);
        }
        res = await ticketsAPI.addBulkTicket(tickets);
      } else res = await ticketsAPI.addTicket(data);
      setSubmitting(false);
      if ((res && res.status === 201) || (res && res.status === 200)) {
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
        errorMessage(res.data.message);
        return;
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
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} mt={0} px={4}>
          <Grid item xs={12} lg={6}>
            <DateTimeChooser
              label="Departure Date Time"
              value={value}
              onChange={(newValue) => {
                setFieldValue('departureDateTime', formatISO(newValue));
                setValue(newValue);
              }}
              error={Boolean(touched.departureDateTime && errors.departureDateTime)}
              helperText={touched.departureDateTime && errors.departureDateTime}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <DateTimeChooser
              label="Departure Date Time"
              value={value2}
              onChange={(newValue) => {
                setFieldValue('arrivalDateTime', formatISO(newValue));
                setValue2(newValue);
              }}
              error={Boolean(touched.arrivalDateTime && errors.arrivalDateTime)}
              helperText={touched.arrivalDateTime && errors.arrivalDateTime}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AirportAutocomplete
              label="Source"
              value={values.source}
              onChange={(v) => setFieldValue('source', v)}
              error={Boolean(touched.source && errors.source)}
              helperText={touched.source && errors.source}
              size="small"
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AirportAutocomplete
              label="Destination"
              value={values.destination}
              onChange={(v) => setFieldValue('destination', v)}
              error={Boolean(touched.destination && errors.destination)}
              helperText={touched.destination && errors.destination}
              size="small"
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <AirlineAutocomplete
              label="Airline"
              value={values.airline}
              onChange={(v) => setFieldValue('airline', v)}
              error={Boolean(touched.airline && errors.airline)}
              helperText={touched.airline && errors.airline}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
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
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="number"
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
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="number"
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
          <Grid item xs={12} lg={6}>
            <TextField fullWidth type="text" label="Note" {...getFieldProps('note')} size="small" />
          </Grid>
          <Grid item xs={6} lg={3}>
            <FormControlLabel
              control={<Switch checked={values.isRefundable} />}
              label="Is Refundable?"
              {...getFieldProps('isRefundable')}
            />
          </Grid>
          <Grid item xs={6} lg={3}>
            <FormControlLabel
              control={<Switch checked={values.isHotDeal} />}
              label="Is Hot Deal?"
              {...getFieldProps('isHotDeal')}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <FormControlLabel
              control={<Switch checked={values.createBulk} />}
              label="Create bulk ticket?"
              {...getFieldProps('createBulk')}
            />
          </Grid>
          {values.createBulk && (
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label="No. Of Days"
                {...getFieldProps('forDays')}
                size="small"
              />
            </Grid>
          )}
        </Grid>
        <Button hidden ref={submitRef} type="submit" />
      </Form>
    </FormikProvider>
  );
}
