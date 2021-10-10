import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Grid,
  TextField,
  Stack,
  Typography,
  Alert,
  AlertTitle,
  Container,
  Tabs,
  Tab
} from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDatePicker, LoadingButton, PickersDay } from '@material-ui/lab';
import { formatISO, format, addDays, subDays, differenceInDays } from 'date-fns';
import enLocale from 'date-fns/locale/en-IN';
import { pillTabsStylesHook } from '@mui-treasury/styles/tabs';
import { styled } from '@material-ui/system';
import BadgeUnstyled from '@material-ui/unstyled/BadgeUnstyled';
import AirportAutocomplete from '../../../components/FormComponents/AirportAutocomplete';
import { errorMessage, getAirportNameById, warningMessage } from '../../../utils/helperFunctions';
import { flightsAPI } from '../../../services/agent';
import { FlightListSpinner } from '../../../components/Spinners';
import { setFlightData, removeFlightData } from '../../../store/actions/bookingAction';
import Page from '../../../components/Page';
import TicketListCard from '../../../components/TicketListCard';

const StyledBadge = styled(BadgeUnstyled)`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  position: relative;
  display: inline-block;
  line-height: 1;

  & .MuiBadge-badge {
    z-index: auto;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    color: #fff;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    text-align: center;
    background: #ff4d4f;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
  }

  & .MuiBadge-dot {
    padding: 0;
    z-index: auto;
    min-width: 6px;
    width: 6px;
    height: 6px;
    background: #00ff00;
    border-radius: 100%;
    box-shadow: 0 0 0 1px #fff;
    transform: translate(0%, -50%);
    position: 'absolute';
    bottom: -10px;
    left: 50%;
  }

  & .MuiBadge-anchorOriginTopRightCircular {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
    // transform-origin: 50% 50%;
  }
`;

export default function SearchTicket() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: navState } = useLocation();

  const [tabIndex, setTabIndex] = React.useState(
    navState.departureDateTime
      ? new Date(navState.departureDateTime).toLocaleDateString()
      : new Date().toLocaleDateString()
  );
  const tabsStyles = pillTabsStylesHook.useTabs();
  const tabItemStyles = pillTabsStylesHook.useTabItem();

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
          : formatISO(new Date(navState.departureDateTime)),
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
  const [availableTicketDates, setAvailableTicketDates] = useState([]);

  const goToConfirmBooking = (flightInfo) => {
    dispatch(setFlightData({ ...flightInfo, passengers: values.quantity }));
    setTimeout(() => {
      navigate('/dashboard/confirmbooking', { replace: false });
    }, 120);
  };

  const getFlights = async () => {
    if (!values.source || !values.destination || !values.departureDateTime) {
      return;
    }
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
      if (navState.departureDateTime) setValue(new Date(navState.departureDateTime));
      getFlights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState]);

  const ticketDates = useMemo(() => {
    if (!navState.departureDateTime) return null;
    setTabIndex(new Date(navState.departureDateTime).toLocaleDateString());
    const dates = [];
    // eslint-disable-next-line for-direction
    for (let i = 4; i >= 1; i -= 1) {
      const d = subDays(new Date(navState.departureDateTime), i);
      const diff = differenceInDays(d, Date.now());
      if (diff >= 0) dates.push(d);
    }
    dates.push(new Date(navState.departureDateTime));
    for (let i = 1; i <= 7; i += 1) {
      dates.push(addDays(new Date(navState.departureDateTime), i));
    }
    return dates;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState]);

  const handleDateTabChange = (_, v) => {
    const today = new Date().toLocaleDateString();
    if (v === today) setFieldValue('departureDateTime', formatISO(new Date()));
    else setFieldValue('departureDateTime', formatISO(new Date(v)));
    handleSubmit();
  };

  const getTicketDates = async () => {
    try {
      setAvailableTicketDates([]);
      if (values.source && values.destination) {
        const res = await flightsAPI.getAvailableTicketDates(values.source, values.destination);
        if (res && res.status === 200) {
          if (res.data && res.data.success) {
            setAvailableTicketDates(
              res.data.data.map((el) => {
                if (Date.now() < new Date(el.departureDateTime)) {
                  return new Date(el.departureDateTime).toLocaleDateString();
                }
                return undefined;
              })
            );
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (values.source && values.destination) {
      getTicketDates();
    }
    setAvailableTicketDates([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.source, values.destination]);

  return (
    <Page title="Dashboard | Agent">
      <Container>
        <Stack sx={{ pt: 3, pb: 6 }}>
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
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
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
                        renderDay={(day, _value, DayComponentProps) => {
                          const isSelected =
                            !DayComponentProps.outsideCurrentMonth &&
                            availableTicketDates.indexOf(day.toLocaleDateString()) !== -1;
                          if (isSelected) {
                            return (
                              <StyledBadge
                                key={day.toString()}
                                color="primary"
                                variant="dot"
                                overlap="circular"
                                badgeContent=" "
                              >
                                <PickersDay {...DayComponentProps} />
                              </StyledBadge>
                            );
                          }
                          return <PickersDay {...DayComponentProps} />;
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
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
                      color="secondary"
                      sx={{ background: '#44af92', color: 'white' }}
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
            {ticketDates && (
              <Grid item xs={12} sx={{ p: 2, backgroundColor: '#f6f4f4' }}>
                <Tabs
                  classes={tabsStyles}
                  variant="scrollable"
                  scrollButtons="auto"
                  value={tabIndex}
                  onChange={handleDateTabChange}
                >
                  {ticketDates.map((d, i) => (
                    <Tab
                      key={`dates-${i}`}
                      classes={tabItemStyles}
                      value={d.toLocaleDateString()}
                      label={format(d, 'd MMM yyyy')}
                      sx={{ minHeight: 20, mx: 3, px: 4 }}
                      centerRipple
                    />
                  ))}
                </Tabs>
              </Grid>
            )}
            <Grid item lg={12} xs={12} md={12}>
              <Stack sx={{ mt: 2, px: 2 }}>
                {flights.map((item, i) => (
                  <TicketListCard
                    item={item}
                    onClick={goToConfirmBooking}
                    key={`ticket-card-${i}`}
                  />
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
