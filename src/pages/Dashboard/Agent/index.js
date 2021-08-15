import { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  AlertTitle,
  Container
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import { formatISO, format } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import AirportAutocomplete from '../../../components/FormComponents/AirportAutocomplete';
import {
  errorMessage,
  getAirlineNameById,
  getAirportNameById,
  warningMessage,
  getDateDuration
} from '../../../utils/helperFunctions';
import { flightsAPI } from '../../../services/agent';
import { FlightListSpinner } from '../../../components/Spinners';
import { setFlightData, removeFlightData } from '../../../store/actions/bookingAction';
import Page from '../../../components/Page';

export default function AgentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filterSchema = Yup.object().shape({
    departureDateTime: Yup.date().required('Departure datetime is required'),
    source: Yup.number().required('Source is required'),
    destination: Yup.number()
      .notOneOf([Yup.ref('source'), null], 'Source and destination cannot be same')
      .required('Destination is required'),
    quantity: Yup.number().typeError('Please enter only numbers').positive()
  });

  const formik = useFormik({
    initialValues: {
      departureDateTime: formatISO(new Date()),
      source: '',
      destination: '',
      quantity: '1'
    },
    validationSchema: filterSchema,
    onSubmit: async () => {
      setError(false);
      setSubmitting(true);
      setFlights([]);
      const data = values;
      if (!data.quantity) delete data.quantity;
      const res = await flightsAPI.searchFlights(values);
      setSubmitting(false);
      if (res && res.status === 201) {
        if (res.data && res.data.status) {
          setFlights(res.data.data);
          return;
        }
        setError(true);
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
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(false);

  const goToConfirmBooking = (flightInfo) => {
    dispatch(setFlightData({ ...flightInfo, passengers: values.quantity }));
    setTimeout(() => {
      navigate('/dashboard/confirmbooking', { replace: false });
    }, 120);
  };

  useEffect(() => {
    dispatch(removeFlightData());
  }, [dispatch]);

  return (
    <Page title="Dashboard | Agent">
      <Container>
        <FormikProvider value={formik}>
          <Stack>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Card sx={{ p: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid xs={12} item lg={3} md={4}>
                    <AirportAutocomplete
                      label="Source"
                      value={values.source}
                      onChange={(v) => setFieldValue('source', v)}
                      error={Boolean(touched.source && errors.source)}
                      helperText={touched.source && errors.source}
                      size="small"
                    />
                  </Grid>
                  <Grid xs={12} item lg={3} md={4}>
                    <AirportAutocomplete
                      label="Destination"
                      value={values.destination}
                      onChange={(v) => setFieldValue('destination', v)}
                      error={Boolean(touched.destination && errors.destination)}
                      helperText={touched.destination && errors.destination}
                      size="small"
                    />
                  </Grid>
                  <Grid xs={12} item lg={3} md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                      <DesktopDatePicker
                        label="Departure DateTime"
                        minDate={new Date()}
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
                  {/* <Grid xs={12} item lg={3} md={4}>
                <TextField id="outlined-basic" label="Outlined" variant="outlined" fullWidth />
              </Grid> */}
                  <Grid xs={12} item lg={3} md={4}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Quantity"
                      {...getFieldProps('quantity')}
                      error={Boolean(touched.quantity && errors.quantity)}
                      helperText={touched.quantity && errors.quantity}
                      size="small"
                    />
                  </Grid>

                  <Grid xs={12} item lg={12} md={12} justifyContent="center" container>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="warning"
                      loading={isSubmitting}
                    >
                      Search Flight
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Card>
            </Form>

            {/* Flights Listings */}
            <Stack sx={{ mt: 2, px: 6 }}>
              {flights.map((item) => (
                <Card sx={{ p: 1, mb: 2 }} key={item.id}>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid>
                      <img
                        src={`/static/airways-logo/${item.airline}.png`}
                        alt={getAirlineNameById(item.airline)}
                        height="72"
                        width="72"
                      />
                    </Grid>
                    <Grid item>
                      <Stack dir="column" alignItems="center">
                        <Typography variant="subtitle2">
                          {getAirlineNameById(item.airline)}
                        </Typography>
                        <Typography>{item.flightNumber}</Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <Stack dir="column" alignItems="center">
                        <Typography variant="subtitle2">
                          {getAirportNameById(item.source)}
                        </Typography>
                        <Typography>{format(new Date(item.departureDateTime), 'HH:mm')}</Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <Typography>
                        {getDateDuration(
                          new Date(item.departureDateTime),
                          new Date(item.arrivalDateTime)
                        )}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Stack dir="column" alignItems="center">
                        <Typography variant="subtitle2">
                          {getAirportNameById(item.destination)}
                        </Typography>
                        <Typography>{format(new Date(item.arrivalDateTime), 'HH:mm')}</Typography>
                      </Stack>
                    </Grid>
                    <Grid>
                      <Typography>{item.isRefundable ? 'Refundable' : 'Non-Refundable'}</Typography>
                    </Grid>
                    <Grid xs={2} item>
                      <Stack dir="column" spacing={1}>
                        <Card
                          sx={{ p: 1, textAlign: 'center', backgroundColor: '#f4f4f4f0' }}
                          elevation={0}
                        >
                          ₹ {item.price}
                        </Card>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => goToConfirmBooking(item)}
                        >
                          BOOK
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
            {error && (
              <Stack sx={{ mt: 2, px: 6 }}>
                <Alert severity="error">
                  <AlertTitle>Sorry !</AlertTitle>
                  No flight tickets found between&nbsp;
                  <strong>{getAirportNameById(values.source)}</strong> -{' '}
                  <strong>{getAirportNameById(values.destination)}</strong>
                </Alert>
              </Stack>
            )}
            {isSubmitting && <FlightListSpinner />}
          </Stack>
        </FormikProvider>
      </Container>
    </Page>
  );
}
