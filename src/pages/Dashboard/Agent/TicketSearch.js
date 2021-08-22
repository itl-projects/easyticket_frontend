import { useEffect, useState, useMemo, useCallback } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
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
  getDateDuration,
  formatPrice
} from '../../../utils/helperFunctions';
import { flightsAPI } from '../../../services/agent';
import { FlightListSpinner } from '../../../components/Spinners';
import { setFlightData, removeFlightData } from '../../../store/actions/bookingAction';
import Page from '../../../components/Page';

export default function SearchTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: navState } = useLocation();

  const filterSchema = Yup.object().shape({
    departureDateTime: Yup.date().required('Departure datetime is required'),
    source: Yup.number().required('Source is required'),
    destination: Yup.number()
      .required('Destination is required')
      .notOneOf([Yup.ref('source'), null], 'Source and destination cannot be same'),
    quantity: Yup.number().typeError('Please enter only numbers').positive()
  });

  const _initialValues = useMemo(() => {
    try {
      return {
        departureDateTime: navState.departureDateTime
          ? formatISO(new Date(navState.departureDateTime))
          : formatISO(new Date()),
        source: Number.isNaN(navState.source) ? '' : Number(navState.source),
        destination: Number.isNaN(navState.destination) ? '' : Number(navState.destination),
        quantity: navState.quantity || '1'
      };
    } catch (err) {
      return {
        departureDateTime: formatISO(new Date()),
        source: '',
        destination: '',
        quantity: '1'
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState]);

  const formik = useFormik({
    initialValues: _initialValues,
    validationSchema: filterSchema,
    onSubmit: async () => {
      navigate('/dashboard/searchTicket', { replace: false, state: { ...values } });
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

  const getFlights = async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    dispatch(removeFlightData());
  }, [dispatch]);

  useEffect(() => {
    const q = {
      ...navState
    };
    if (q.source && q.destination && q.departureDateTime) {
      getFlights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState]);

  return (
    <Page title="Dashboard | Agent">
      <Container>
        <Stack>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Card sx={{ p: 2, backgroundColor: '#31ca6eb8' }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid xs={12} item lg={3} md={4}>
                    <Typography sx={{ mb: 1, pl: 1 }}>From</Typography>
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
                    <Typography sx={{ mb: 1, pl: 1 }}>To</Typography>
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
                    <Typography sx={{ mb: 1, pl: 1 }}>Departure DateTime</Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
                      <DesktopDatePicker
                        placeholder="Departure DateTime"
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
                    <Typography sx={{ mb: 1, pl: 1 }}>Quantity</Typography>
                    <TextField
                      fullWidth
                      type="text"
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      placeholder="Quantity"
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
          </FormikProvider>
          {/* Flights Listings */}
          <Grid container justifyContent="center">
            <Grid item lg={12} xs={12} md={12}>
              <Stack sx={{ mt: 2, px: 2 }}>
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
                          <Typography>
                            {format(new Date(item.departureDateTime), 'HH:mm')}
                          </Typography>
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
                        <Typography>
                          {item.isRefundable ? 'Refundable' : 'Non-Refundable'}
                        </Typography>
                      </Grid>
                      <Grid xs={2} item>
                        <Stack dir="column" spacing={1}>
                          <Card
                            sx={{ p: 1, textAlign: 'center', backgroundColor: '#f4f4f4f0' }}
                            elevation={0}
                          >
                            ₹ {formatPrice(item.price)}
                          </Card>
                          <Button
                            variant="contained"
                            color="primary"
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
            </Grid>
          </Grid>

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
      </Container>
    </Page>
  );
}
