// material
import * as Yup from 'yup';
import { useState } from 'react';
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

// ----------------------------------------------------------------------

export default function BookingsPage() {
  const changePasswordSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter first Name'),
    lastName: Yup.string().required('Please enter last name'),
    company: Yup.string().required('Please enter company name'),
    address: Yup.string()
  });

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [travelDate, setTravelDate] = useState(null);

  const formik = useFormik({
    initialValues: {
      bookingRef: '',
      fromDate: '',
      toDate: '',
      travelDate: '',
      pnr: ''
    },
    validationSchema: changePasswordSchema,
    onSubmit: async () => {}
  });

  const { values, getFieldProps, setFieldValue } = formik;

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
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment position="end">
                        //       <IconButton edge="end">
                        //         <Icon icon={pnrIcon} />
                        //       </IconButton>
                        //     </InputAdornment>
                        //   )
                        // }}
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
                      <TextField
                        fullWidth
                        type="text"
                        label="Airline"
                        size="small"
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment position="end">
                        //       <IconButton edge="end">
                        //         <Icon icon={flightIcon} />
                        //       </IconButton>
                        //     </InputAdornment>
                        //   )
                        // }}
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
                  <AppActiveUsers title="Bookings" accualCount={24} totalCount={67} />
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
