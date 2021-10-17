// material
import { useState, useEffect } from 'react';
import { Card, Container, Typography, Grid, TextField, Stack } from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import { useFormik, Form, FormikProvider } from 'formik';
// components
import Page from '../../../components/Page';
//
import TicketModal from '../../../components/Modals/TicketModal';
import AppActiveUsers from '../../../components/_dashboard/app/AppActiveUsers';
import { BookingsListTable } from '../../../components/_adminDashboard/Bookings';
import AirlineAutocomplete from '../../../components/FormComponents/AirlineAutocomplete';
import { bookingsAPI } from '../../../services/admin';

// ----------------------------------------------------------------------

export default function BookingsPage() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [travelDate, setTravelDate] = useState(null);
  const [bookingCount, setBookingCounts] = useState({
    booked: 0,
    total: 0
  });

  const formik = useFormik({
    initialValues: {
      bookingRef: '',
      fromDate: '',
      toDate: '',
      travelDate: '',
      pnr: '',
      airline: 0
    },
    onSubmit: async () => {}
  });

  const { values, getFieldProps, setFieldValue } = formik;

  const getBookingCounts = async () => {
    const res = await bookingsAPI.getBookingCounts();
    if (res && res.status === 200) {
      if (res.data && res.data.success) {
        setBookingCounts(res.data.data);
      }
    }
  };

  useEffect(() => {
    getBookingCounts();
  }, []);

  return (
    <Page title="Dashboard | Bookings">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Bookings
          </Typography>
        </Stack>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} lg={8} my={2}>
            <FormikProvider value={formik}>
              <Form>
                <Card sx={{ px: 2, py: 2 }}>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        type="text"
                        label="PNR"
                        size="small"
                        {...getFieldProps('pnr')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        type="text"
                        label="Booking Ref"
                        size="small"
                        {...getFieldProps('bookingRef')}
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment position="end">
                        //       <IconButton edge="end">
                        //         <Icon icon={bookingRefIcon} />
                        //       </IconButton>
                        //     </InputAdornment>
                        //   )
                        // }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Travel Date"
                          value={travelDate}
                          onChange={(newValue) => {
                            setFieldValue('travelDate', newValue);
                            setTravelDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Start Date"
                          value={fromDate}
                          onChange={(newValue) => {
                            setFieldValue('fromDate', newValue);
                            setFromDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="End Date"
                          value={toDate}
                          onChange={(newValue) => {
                            setFieldValue('toDate', newValue);
                            setToDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <AirlineAutocomplete
                        label="Airline"
                        value={values.airline}
                        onChange={(v) => setFieldValue('airline', v)}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Form>
            </FormikProvider>
          </Grid>
          <Grid item xs={12} lg={4} my={2}>
            <Card sx={{ p: 2 }}>
              <Grid
                columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 1 }}
                container
                direction="column"
                rowGap={1}
              >
                <Grid xs={12}>
                  <AppActiveUsers
                    title="Bookings"
                    accualCount={bookingCount.booked}
                    totalCount={bookingCount.total}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        <Card>
          <BookingsListTable filters={values} />
        </Card>
      </Container>
      <TicketModal />
    </Page>
  );
}
