import { useEffect, useState } from 'react';
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
  Typography
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import { formatISO } from 'date-fns';
import frLocale from 'date-fns/locale/fr';
import AirportAutocomplete from '../../../components/FormComponents/AirportAutocomplete';
import { removeFlightData } from '../../../store/actions/bookingAction';
import Page from '../../../components/Page';

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

  useEffect(() => {
    dispatch(removeFlightData());
  }, [dispatch]);

  const handleTabChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  return (
    <Page title="Dashboard | Agent" sx={{ mt: -2 }}>
      <Stack>
        <Box sx={{ background: 'url(/static/images/search_banner.png)', backgroundSize: 'cover' }}>
          <Container sx={{ py: 8 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Card sx={{ px: 1, pt: 1, pb: 2, background: '#ffffffb8' }}>
                  <Grid container>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                      <Tab label="ONE WAY" sx={{ background: '#31ca6e', color: 'white', px: 8 }} />
                    </Tabs>
                    {/* </Grid> */}
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
                        color="primary"
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
      </Stack>
    </Page>
  );
}
