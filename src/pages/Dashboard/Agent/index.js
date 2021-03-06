import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Grid,
  TextField,
  Box,
  Container,
  Tab,
  Tabs,
  Divider,
  Typography,
  Button
} from '@material-ui/core';
import { styled } from '@material-ui/system';
import BadgeUnstyled from '@material-ui/unstyled/BadgeUnstyled';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDatePicker, LoadingButton, PickersDay } from '@material-ui/lab';
import { formatISO } from 'date-fns';
import enLocale from 'date-fns/locale/en-IN';
import AirportAutocomplete from '../../../components/FormComponents/AirportAutocomplete';
import { removeFlightData } from '../../../store/actions/bookingAction';
import Page from '../../../components/Page';
import { getAirportNameById } from '../../../utils/helperFunctions';
import HotDeals from '../../../data/hotDeals.json';
import { flightsAPI } from '../../../services/agent';
import { HotDealLoadingSkeleton } from '../../../components/skeletons';

const hotDealsTabBgs = [
  'rgba(4, 34, 82, 0.9)',
  'rgba(2, 53, 42, 0.9)',
  'rgba(28, 77, 80, 0.9)',
  'rgba(90, 79, 57, 0.9)',
  'rgba(66, 19, 97, 0.9)',
  'rgba(58, 13, 19, 0.9)',
  'rgba(6, 95, 75, 0.9)',
  'rgba(98, 13, 37, 0.9)',
  'rgba(98, 13, 37, 0.9)	rgba(62, 30, 85, 0.9)'
];

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

export default function AgentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filterSchema = Yup.object().shape({
    departureDateTime: Yup.date().required('Departure datetime is required'),
    source: Yup.number().required('Source is required'),
    destination: Yup.number()
      .required('Destination is required')
      .notOneOf([Yup.ref('source'), null], 'Source and destination cannot be same'),
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
      navigate('/dashboard/searchTicket', { replace: false, state: { ...values } });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  const [value, setValue] = useState(new Date());
  const [activeTab, setActiveTab] = useState(0);
  const [hotDealSelected, setHotDealSelected] = useState(0);
  const [deals, setDeals] = useState(null);
  const [loadingHotDeals, setHotDealLoading] = useState(false);
  const [ticketDates, setTicketDates] = useState([]);

  useEffect(() => {
    dispatch(removeFlightData());
  }, [dispatch]);

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const handleHotDealChange = (e, v) => {
    setHotDealSelected(v);
  };

  const getHostDeals = async () => {
    setHotDealLoading(true);
    const res = await flightsAPI.getHotDeals(Object.values(HotDeals)[hotDealSelected]);
    setHotDealLoading(false);
    if (res && res.status === 200) {
      setDeals(res.data.data);
    }
  };

  useMemo(() => {
    getHostDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotDealSelected]);

  const searchHotDealTicketFlight = ({ source, destination, departureDateTime }) => {
    const data = {
      departureDateTime,
      source,
      destination,
      quantity: '1'
    };
    navigate('/dashboard/searchTicket', { replace: false, state: { ...data } });
  };

  const getTicketDates = async () => {
    try {
      setTicketDates([]);
      if (values.source && values.destination) {
        const res = await flightsAPI.getAvailableTicketDates(values.source, values.destination);
        if (res && res.status === 200) {
          if (res.data && res.data.success) {
            setTicketDates(
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
    setTicketDates([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.source, values.destination]);

  return (
    <Page
      title="Dashboard | Agent"
      sx={{
        mt: -2,
        background: 'url(/static/images/search_banner.jpg)',
        backgroundSize: 'cover',
        height: 'calc(100% + 16px)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container>
          {/* <Box sx={{ background: 'url(/static/images/search_banner.png)', backgroundSize: 'cover' }}> */}
          <Grid item xs={12} md={6}>
            <Container sx={{ py: 6 }}>
              <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Grid container alignItems="center">
                    <Grid item xs={6} md={10}>
                      <Typography fontSize={24} color="white">
                        Book Your Flights
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        scrollButtons={false}
                      >
                        <Tab
                          label="One Way"
                          sx={{
                            background: '#44af92',
                            px: 0,
                            py: 0,
                            minHeight: '40px'
                            // fontSize: 18
                          }}
                          style={{ color: 'white' }}
                        />
                      </Tabs>
                    </Grid>
                  </Grid>
                  {/* <Divider sx={{ mb: 5 }} /> */}
                  <Card sx={{ px: 2, py: 4, background: '#ffffff' }} className="custom-card">
                    <Grid container spacing={2} justifyContent="center" sx={{ px: 1 }}>
                      <Grid xs={12} item lg={6} md={6}>
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
                      <Grid xs={12} item lg={6} md={6}>
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
                      <Grid xs={12} item lg={6} md={6}>
                        <Typography sx={{ mb: 1, pl: 1 }}>Departure Datetime</Typography>
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
                                error={Boolean(
                                  touched.departureDateTime && errors.departureDateTime
                                )}
                                helperText={touched.departureDateTime && errors.departureDateTime}
                                size="small"
                              />
                            )}
                            renderDay={(day, _value, DayComponentProps) => {
                              const isSelected =
                                !DayComponentProps.outsideCurrentMonth &&
                                ticketDates.indexOf(day.toLocaleDateString()) !== -1;
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
                      <Grid xs={12} item lg={6} md={6}>
                        <Typography sx={{ mb: 1, pl: 1 }}>Quantity</Typography>
                        <TextField
                          fullWidth
                          type="text"
                          placeholder="Quantity"
                          {...getFieldProps('quantity')}
                          error={Boolean(touched.quantity && errors.quantity)}
                          helperText={touched.quantity && errors.quantity}
                          size="small"
                        />
                      </Grid>
                      <Grid xs={12} item lg={12} md={12} justifyContent="flex-end" container>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          color="secondary"
                          sx={{ color: 'white', py: 1.5, px: 6, mt: 2, fontSize: 18 }}
                          loading={isSubmitting}
                        >
                          Search Flight
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Card>
                </Form>
              </FormikProvider>
            </Container>
          </Grid>
          {/* </Box>
        <Box> */}
          <Grid item xs={12} md={6}>
            <Container sx={{ pt: 2, py: 6 }}>
              <Card sx={{ px: 0, pt: 0, pb: 2, background: '#ffffff' }}>
                <Typography variant="h5" color="black" sx={{ p: 3 }}>
                  Hot Deals
                </Typography>
                {/* <Grid container> */}
                <Tabs
                  value={hotDealSelected}
                  onChange={handleHotDealChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  indicatorColor="secondary"
                >
                  {HotDeals &&
                    Object.keys(HotDeals).map((key, i) => (
                      <Tab
                        label={`Ex ${key}`}
                        sx={{
                          background: hotDealsTabBgs[i],
                          px: 2
                        }}
                        style={{ color: 'white' }}
                        key={`tab-${i}-${key}`}
                        value={i}
                      />
                    ))}
                </Tabs>
                {/* </Grid> */}
                <Divider sx={{ mb: 5 }} />

                <Box sx={{ px: 2, pb: 2 }}>
                  <Grid container spacing={2} flexWrap>
                    {deals &&
                      !loadingHotDeals &&
                      deals.map((sd, index) => (
                        <Grid
                          key={`openedtab-${index}-${hotDealSelected}`}
                          item
                          xs={6}
                          md={4}
                          lg={3}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ py: 2, background: hotDealsTabBgs[index % 10], color: 'white' }}
                            fullWidth
                            onClick={() => searchHotDealTicketFlight({ ...sd })}
                          >
                            {getAirportNameById(sd.source)} - {getAirportNameById(sd.destination)}
                          </Button>
                        </Grid>
                      ))}
                    {loadingHotDeals && <HotDealLoadingSkeleton />}
                    {deals && deals.length <= 0 && !loadingHotDeals && (
                      <Grid item xs={12}>
                        <Typography textAlign="center">No hot deal available now.</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Card>
            </Container>
          </Grid>
          {/* </Box> */}
        </Grid>
      </Container>
    </Page>
  );
}
