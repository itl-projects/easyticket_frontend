import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Grid,
  TextField,
  Stack,
  Box,
  Container,
  Tab,
  Tabs,
  Divider,
  Typography,
  Button
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
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

  return (
    <Page title="Dashboard | Agent" sx={{ mt: -2 }}>
      <Stack>
        <Box sx={{ background: 'url(/static/images/search_banner.png)', backgroundSize: 'cover' }}>
          <Container sx={{ py: 6 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Card sx={{ px: 1, pt: 1, pb: 2, background: '#ffffffb8' }}>
                  <Grid container>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                      <Tab
                        label="ONE WAY"
                        sx={{ background: '#f4621f', px: 8 }}
                        style={{ color: 'white' }}
                      />
                    </Tabs>
                  </Grid>
                  <Divider sx={{ mb: 5 }} />
                  <Grid container spacing={2} justifyContent="center" sx={{ px: 1 }}>
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
                              error={Boolean(touched.departureDateTime && errors.departureDateTime)}
                              helperText={touched.departureDateTime && errors.departureDateTime}
                              size="small"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid xs={12} item lg={3} md={4}>
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

                    <Grid xs={12} item lg={12} md={12} justifyContent="center" container>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="warning"
                        sx={{ background: '#f4621f', color: 'white' }}
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
        </Box>
        <Box>
          <Container sx={{ pt: 2 }}>
            <Card sx={{ px: 0, pt: 0, pb: 2, background: '#ffffffb8' }}>
              {/* <Grid container> */}
              <Tabs
                value={hotDealSelected}
                onChange={handleHotDealChange}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="#00000000"
              >
                {HotDeals &&
                  Object.keys(HotDeals).map((key, i) => (
                    <Tab
                      label={key}
                      sx={{
                        background: hotDealsTabBgs[i],
                        px: 8
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
                <Grid container spacing={2}>
                  {deals &&
                    !loadingHotDeals &&
                    deals.map((sd, index) => (
                      <Grid key={`openedtab-${index}-${hotDealSelected}`} item xs={4} md={3} lg={2}>
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
                      <Typography textAlign="center">Not Found !</Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Card>
          </Container>
        </Box>
      </Stack>
    </Page>
  );
}
