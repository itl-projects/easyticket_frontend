import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Grid,
  TextField,
  Checkbox,
  Stack,
  Typography,
  CardHeader,
  CardContent,
  Divider,
  MenuItem,
  FormControlLabel,
  Container,
  Box
} from '@material-ui/core';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FieldArray } from 'formik';
import { LoadingButton } from '@material-ui/lab';
import { format } from 'date-fns';
import enLocale from 'date-fns/locale/en-IN';
import {
  getAirlineNameById,
  getAirportNameById,
  warningMessage,
  getDateDuration,
  formatPrice
} from '../../../utils/helperFunctions';
import { bookingsAPI } from '../../../services/agent';
import Page from '../../../components/Page';
import { setBookingData } from '../../../store/actions/bookingAction';

export default function ConfirmBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flight } = useSelector((state) => state.booking);

  const bookingSchema = Yup.object().shape({
    passengers: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Title is required'),
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required')
      })
    ),
    agree: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
    markup: Yup.number(),
    mobile: Yup.string()
      .max(10, 'Invalid mobile number')
      .min(10, 'Invalid mobile number')
      .required('Mobile is required'),
    email: Yup.string().email().required('Email is required'),
    note: Yup.string()
  });

  const _initialValues = useMemo(() => {
    const p = [
      {
        title: '',
        firstName: '',
        lastName: ''
      }
    ];
    if (flight) {
      const count = parseInt(flight.passengers, 10);
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < count; i++) {
        p.push({
          title: '',
          firstName: '',
          lastName: ''
        });
      }
    }
    return {
      passengers: p,
      agree: false,
      markup: '',
      mobile: '',
      email: '',
      note: ''
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight]);

  const formik = useFormik({
    initialValues: _initialValues,
    validationSchema: bookingSchema,
    onSubmit: async () => {
      setSubmitting(true);
      const passengers = values.passengers.map((item) => ({
        ...item,
        mobile: values.mobile,
        email: values.email,
        note: values.note
      }));
      const data = {
        ticket: flight.id,
        quantity: parseInt(flight.passengers, 10),
        passengers,
        markup: values.markup || 0
      };
      const res = await bookingsAPI.bookFlight(data);
      setSubmitting(false);
      if (res && res.status === 201) {
        if (res.data && res.data.status) {
          dispatch(setBookingData(res.data.data));
          setTimeout(() => {
            navigate('/dashboard/bookingsuccess', { replace: true });
          }, 120);
          return;
        }
      }
      if (res && res.data) {
        if (res.data && res.status === 400) {
          if (typeof res.data.message === 'object' && res.data.message.length > 0) {
            res.data.message.forEach((el) => {
              if (el.split('.').length === 3) {
                const splits = el.split(' ');
                setFieldError(splits[0], splits[1]);
              } else warningMessage(el);
            });
            return;
          }
          warningMessage(res.data.message);
          return;
        }
      }
      navigate('/dashboard/bookingfailed', { replace: true });
    }
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
    setSubmitting,
    setFieldError
  } = formik;

  const totalAmount = useMemo(() => {
    try {
      return flight.price * parseInt(flight.passengers, 10) + values.markup;
    } catch (err) {
      return flight.price * parseInt(flight.passengers, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.markup]);

  if (!flight) window.history.back();

  const tickerFare = flight.price * parseInt(flight.passengers, 10);

  return (
    <Page title="Dashboard | Confirm Booking">
      <Container>
        <Stack>
          <Card sx={{ p: 0 }}>
            <Typography textAlign="center" sx={{ m: 0, py: 1 }}>
              {getAirportNameById(flight.source)}-{getAirportNameById(flight.destination)}&nbsp;
              {format(new Date(flight.departureDateTime), 'dd-MMM-yyyy HH:mm', {
                timezone: 'Asia/Kolkata'
              })}
            </Typography>
          </Card>
          <Card sx={{ p: 1, mb: 2, mt: 1, px: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <img
                  src={`/static/airways-logo/${flight.airline}.png`}
                  alt={getAirlineNameById(flight.airline)}
                  height="72"
                  width="72"
                />
              </Grid>
              <Grid item>
                <Stack dir="column" alignItems="center">
                  <Typography variant="subtitle2">{getAirlineNameById(flight.airline)}</Typography>
                  <Typography>{flight.flightNumber}</Typography>
                </Stack>
              </Grid>
              <Grid>
                <Stack dir="column" alignItems="center">
                  <Typography variant="subtitle2">{getAirportNameById(flight.source)}</Typography>
                  <Typography>
                    {format(new Date(flight.departureDateTime), 'HH:mm', {
                      timezone: 'Asia/Kolkata'
                    })}
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <Typography>
                  {getDateDuration(
                    new Date(flight.departureDateTime),
                    new Date(flight.arrivalDateTime)
                  )}
                </Typography>
              </Grid>
              <Grid>
                <Stack dir="column" alignItems="center">
                  <Typography variant="subtitle2">
                    {getAirportNameById(flight.destination)}
                  </Typography>
                  <Typography>
                    {format(new Date(flight.arrivalDateTime), 'HH:mm', {
                      timezone: 'Asia/Kolkata'
                    })}
                  </Typography>
                </Stack>
              </Grid>
              <Grid>
                <Typography>{flight.isRefundable ? 'Refundable' : 'Non-Refundable'}</Typography>
              </Grid>
            </Grid>
          </Card>

          <FormikProvider value={formik}>
            <Stack>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Card sx={{ my: 1 }}>
                  <CardHeader
                    subheader="Traveller Details - Kindly Fill Traveller Details as per ID"
                    subheaderTypographyProps={{ variant: 'body2', color: 'white' }}
                    sx={{ p: 1, background: '#f4621f', color: '#fff' }}
                  />
                  <CardContent>
                    <FieldArray
                      name="passengers"
                      render={(_) =>
                        values.passengers.map((passenger, index) => (
                          <Grid
                            container
                            spacing={2}
                            justifyContent="center"
                            key={`passenger-info-${index}`}
                            sx={{ mt: index > 0 ? 1 : -1 }}
                          >
                            <Grid xs={12} item lg={3} md={4}>
                              <TextField
                                fullWidth
                                select
                                type="text"
                                label="Title"
                                {...getFieldProps(`passengers[${index}].title`)}
                                size="small"
                                error={Boolean(
                                  errors.passengers &&
                                    errors.passengers[index] &&
                                    errors.passengers[index].title &&
                                    touched.passengers &&
                                    touched.passengers[index] &&
                                    touched.passengers[index].title
                                )}
                                helperText={
                                  errors.passengers &&
                                  errors.passengers[index] &&
                                  touched.passengers &&
                                  touched.passengers[index] &&
                                  touched.passengers[index].title &&
                                  errors.passengers[index].title
                                }
                              >
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid xs={12} item lg={3} md={4}>
                              <TextField
                                fullWidth
                                type="text"
                                label="First Name"
                                {...getFieldProps(`passengers[${index}].firstName`)}
                                size="small"
                                error={Boolean(
                                  errors.passengers &&
                                    errors.passengers[index] &&
                                    errors.passengers[index].firstName &&
                                    touched.passengers &&
                                    touched.passengers[index] &&
                                    touched.passengers[index].firstName
                                )}
                                helperText={
                                  errors.passengers &&
                                  errors.passengers[index] &&
                                  touched.passengers &&
                                  touched.passengers[index] &&
                                  touched.passengers[index].firstName &&
                                  errors.passengers[index].firstName
                                }
                              />
                            </Grid>

                            <Grid xs={12} item lg={3} md={4}>
                              <TextField
                                fullWidth
                                type="text"
                                label="Last Name"
                                {...getFieldProps(`passengers[${index}].lastName`)}
                                size="small"
                                error={Boolean(
                                  errors.passengers &&
                                    errors.passengers[index] &&
                                    errors.passengers[index].lastName &&
                                    touched.passengers &&
                                    touched.passengers[index] &&
                                    touched.passengers[index].lastName
                                )}
                                helperText={
                                  errors.passengers &&
                                  errors.passengers[index] &&
                                  touched.passengers &&
                                  touched.passengers[index] &&
                                  touched.passengers[index].lastName &&
                                  errors.passengers[index].lastName
                                }
                              />
                            </Grid>
                          </Grid>
                        ))
                      }
                    />
                  </CardContent>
                </Card>
                <Card sx={{ my: 1 }}>
                  <CardHeader
                    subheader="Contact Information"
                    subheaderTypographyProps={{ variant: 'body2', color: 'white' }}
                    sx={{ p: 1, background: '#f4621f', color: '#fff' }}
                  />
                  <CardContent>
                    <Grid container spacing={2} justifyContent="center">
                      <Grid xs={12} item lg={3} md={4}>
                        <TextField
                          fullWidth
                          type="text"
                          label="Mobile Number"
                          {...getFieldProps('mobile')}
                          size="small"
                          error={Boolean(touched.mobile && errors.mobile)}
                          helperText={touched.mobile && errors.mobile}
                        />
                      </Grid>
                      <Grid xs={12} item lg={3} md={4}>
                        <TextField
                          fullWidth
                          type="text"
                          label="Email Address"
                          {...getFieldProps('email')}
                          size="small"
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>

                      <Grid xs={12} item lg={3} md={4}>
                        <TextField
                          fullWidth
                          type="text"
                          label="Internal Note"
                          {...getFieldProps('note')}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                <Card sx={{ my: 1 }}>
                  <CardHeader
                    subheader="Fare Summary"
                    subheaderTypographyProps={{ variant: 'body2', color: 'white' }}
                    sx={{ p: 1, background: '#f4621f', color: '#fff' }}
                  />
                  <CardContent sx={{ p: 0, py: 1 }}>
                    <Grid container sx={{ p: 1 }}>
                      <Grid xs={6} item lg={10} md={8}>
                        Ticket Fee
                      </Grid>
                      <Divider orientation="vertical" flexItem />
                      <Grid xs={5} item lg={1} md={3} sx={{ ml: 1 }}>
                        ₹ {formatPrice(tickerFare)}
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container sx={{ p: 1 }}>
                      <Grid xs={6} item lg={10} md={8}>
                        Mark up
                      </Grid>
                      <Grid xs={5} item lg={2} md={3} display="flex">
                        <Divider orientation="vertical" flexItem />
                        <Box sx={{ pl: 1 }}>
                          <TextField
                            fullWidth
                            type="number"
                            // label="Markup Amount"
                            placeholder="Markup Amount"
                            size="small"
                            {...getFieldProps('markup')}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container sx={{ p: 1, pb: 0 }}>
                      <Grid xs={6} item lg={10} md={8}>
                        Total Amount Payable
                      </Grid>
                      <Divider orientation="vertical" flexItem />
                      <Grid xs={5} item lg={1} md={3} sx={{ ml: 1 }}>
                        ₹ {formatPrice(totalAmount)}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Grid
                  xs={12}
                  lg={12}
                  md={12}
                  mt={2}
                  justifyContent="space-between"
                  item
                  display="flex"
                >
                  <Stack>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...getFieldProps('agree')}
                          checked={values.agree}
                          // sx={{ py: 0 }}
                        />
                      }
                      label="I agree to the Terms & Conditions"
                    />
                    <Typography color="red" variant="body2" ml={4} mt={-1}>
                      {touched.agree && errors.agree}
                    </Typography>
                  </Stack>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="warning"
                    sx={{ background: '#f4621f', color: 'white', py: 2 }}
                    loading={isSubmitting}
                  >
                    CONFIRM BOOKING
                  </LoadingButton>
                </Grid>
              </Form>
            </Stack>
          </FormikProvider>
        </Stack>
      </Container>
    </Page>
  );
}
