import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// import flightIcon from '@iconify/icons-ic/baseline-flight';
import flightTackoffIcon from '@iconify/icons-ic/baseline-flight-takeoff';
import flightLandIcon from '@iconify/icons-ic/baseline-flight-land';
// material
import {
  Card,
  Container,
  Button,
  Stack,
  Typography,
  MenuItem,
  Grid,
  TextField,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import { useFormik, Form, FormikProvider } from 'formik';
// components
import Page from '../../../components/Page';
import { useAdminContext } from '../../../context/AdminContext';
import TicketModal from '../../../components/Modals/TicketModal';
import AppActiveUsers from '../../../components/_dashboard/app/AppActiveUsers';
import { Tickets } from '../../../components/_adminDashboard/Tickets';
import AirlineAutocomplete from '../../../components/FormComponents/AirlineAutocomplete';
import AirportAutocomplete from '../../../components/FormComponents/AirportAutocomplete';

// ----------------------------------------------------------------------

export default function TicketListPage() {
  const adminContext = useAdminContext();
  const { toggleShowTicketModal } = adminContext;

  const bookingFilterSchema = Yup.object().shape({
    source: Yup.string(),
    destination: Yup.string(),
    uploadedBy: Yup.number(),
    departureDate: Yup.string(),
    arrivalDate: Yup.string(),
    aireline: Yup.number(),
    status: Yup.string()
  });

  const [departureDate, setDepartureDate] = useState(null);
  const [arrivalDate, setArrivalDate] = useState(null);

  const formik = useFormik({
    initialValues: {
      source: 0,
      destination: 0,
      uploadedBy: 0,
      departureDate: '',
      arrivalDate: '',
      aireline: 0
    },
    validationSchema: bookingFilterSchema,
    onSubmit: async () => {}
  });

  const { values, getFieldProps, setFieldValue } = formik;

  return (
    <Page title="Dashboard | Tickets">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Tickets
          </Typography>
          <Button
            variant="contained"
            onClick={() => toggleShowTicketModal(null, {})}
            startIcon={<Icon icon={plusFill} />}
          >
            Add Ticket
          </Button>
        </Stack>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} lg={8} my={2}>
            <FormikProvider value={formik}>
              <Form>
                <Card sx={{ px: 2, py: 3 }}>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Departure Date"
                          value={departureDate}
                          onChange={(newValue) => {
                            setFieldValue('departureDate', newValue);
                            setDepartureDate(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                              fullWidth
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
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Arrival Date"
                          value={arrivalDate}
                          onChange={(newValue) => {
                            setFieldValue('arrivalDate', newValue);
                            setArrivalDate(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                              fullWidth
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
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        size="small"
                        label="Uploaded By"
                        select
                        fullWidth
                        {...getFieldProps('uploadedBy')}
                      >
                        <MenuItem value={0}>All</MenuItem>
                        <MenuItem value={2}>Admin</MenuItem>
                        <MenuItem value={3}>Supplier</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <AirlineAutocomplete
                        label="Airline"
                        value={values.airline}
                        onChange={(v) => setFieldValue('airline', v)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <AirportAutocomplete
                        label="Source"
                        value={values.source}
                        onChange={(v) => setFieldValue('source', v)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <AirportAutocomplete
                        label="Destination"
                        value={values.destination}
                        onChange={(v) => setFieldValue('destination', v)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Form>
            </FormikProvider>
          </Grid>
          <Grid item xs={12} lg={4} my={2}>
            <Card sx={{ px: 2, py: 1.2 }}>
              <Grid
                columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 1 }}
                container
                direction="column"
                rowGap={1}
              >
                <Grid xs={12}>
                  <AppActiveUsers title="Admin Tickets" accualCount={24} totalCount={67} />
                </Grid>
                <Grid xs={12}>
                  <AppActiveUsers title="Supplier Tickets" accualCount={24} totalCount={67} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ px: 0 }}>
          <Tickets filters={values} />
        </Card>
      </Container>
      <TicketModal />
    </Page>
  );
}
