import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import pnrIcon from '@iconify/icons-ic/baseline-airplane-ticket';
import bookingRefIcon from '@iconify/icons-ic/baseline-approval';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Card,
  Container,
  Typography,
  Grid,
  TextField,
  IconButton,
  Stack,
  Button,
  InputAdornment,
  MenuItem
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
// components
import Page from '../../../components/Page';
//
import FundTransferModal from '../../../components/Modals/FundTransferModal';
// import AppActiveUsers from '../../../components/_dashboard/app/AppActiveUsers';
import { CreditsListTable } from '../../../components/_adminDashboard/Credits';
import { useAdminContext } from '../../../context/AdminContext';
import CreditApproveModal from '../../../components/Modals/CreditApproveModal';
// ----------------------------------------------------------------------

export default function BookingsPage() {
  const adminContext = useAdminContext();
  const { toggleShowFundTransferModal } = adminContext;

  const bookingFilterSchema = Yup.object().shape({
    creditRef: Yup.string(),
    agentRef: Yup.string(),
    requestDate: Yup.string(),
    company: Yup.string(),
    transferDate: Yup.string(),
    status: Yup.string()
  });

  const [requestDate, setRequestDate] = useState(null);
  const [transferDate, setTransferDate] = useState(null);

  const formik = useFormik({
    initialValues: {
      creditRef: '',
      agentRef: '',
      company: '',
      requestDate: '',
      transferDate: '',
      status: 'all'
    },
    validationSchema: bookingFilterSchema,
    onSubmit: async () => {}
  });

  const { values, getFieldProps, setFieldValue } = formik;

  return (
    <Page title="Dashboard | Credits">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Credits
          </Typography>
          <Button
            variant="contained"
            onClick={toggleShowFundTransferModal}
            startIcon={<Icon icon={plusFill} />}
          >
            Fund Transfer
          </Button>
        </Stack>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} lg={12} my={2}>
            <FormikProvider value={formik}>
              <Form>
                <Card sx={{ px: 2, py: 2 }}>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        type="text"
                        label="Credit Ref"
                        size="small"
                        {...getFieldProps('creditRef')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end">
                                <Icon icon={pnrIcon} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        type="text"
                        label="Agent Ref"
                        size="small"
                        {...getFieldProps('agentRef')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end">
                                <Icon icon={bookingRefIcon} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        type="text"
                        label="Agency Name"
                        size="small"
                        {...getFieldProps('company')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Request Date"
                          value={requestDate}
                          onChange={(newValue) => {
                            setFieldValue('requestDate', newValue);
                            setRequestDate(newValue);
                          }}
                          clearable
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Transter Date"
                          size="small"
                          value={transferDate}
                          onChange={(newValue) => {
                            setFieldValue('transferDate', newValue);
                            setTransferDate(newValue);
                          }}
                          clearable
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        label="Status"
                        select
                        fullWidth
                        size="small"
                        {...getFieldProps('status')}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="settled">Settled</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Card>
              </Form>
            </FormikProvider>
          </Grid>
          {/* <Grid item xs={12} lg={4} my={2}>
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
          </Grid> */}
        </Grid>
        <Card>
          <CreditsListTable filters={values} />
          <CreditApproveModal />
        </Card>
      </Container>
      <FundTransferModal />
    </Page>
  );
}
