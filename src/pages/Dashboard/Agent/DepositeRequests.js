import { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Stack,
  Typography,
  TableContainer,
  TableRow,
  Container,
  Table,
  TableHead,
  TableBody,
  TablePagination
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { format } from 'date-fns';
import Label from '../../../components/Label';
import Page from '../../../components/Page';
import { creditRequestAPI } from '../../../services/agent';
import { TableSkeleton } from '../../../components/skeletons';
import { useAdminContext } from '../../../context/AdminContext';
import CreditRequestModal from '../../../components/Modals/CreditRequestModal';
import { formatPrice } from '../../../utils/helperFunctions';
import StyledTableCell from '../../../components/core/StyledTableCell';

export default function DepositeRequests() {
  const adminContext = useAdminContext();
  const { showCreditRequestModal, toggleShowCreditRequestModal } = adminContext;

  const [page, setPage] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getMyCreditRequests = async () => {
    setLoading(true);
    const data = {
      page: page + 1,
      limit: rowsPerPage
    };
    const res = await creditRequestAPI.getCreditRequests(data);
    setLoading(false);
    if (res && res.status === 201) {
      setTotalBookings(res.data.meta.totalItems);
      setBookings(res.data.data);
    }
  };

  useEffect(() => {
    if (!showCreditRequestModal) getMyCreditRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, showCreditRequestModal]);

  const getStatusColor = (status) => {
    if (status === 'cancelled') return 'error';
    if (status === 'pending') return 'warning';
    if (status === 'approved') return 'success';
    return 'info';
  };

  return (
    <Page title="Dashboard | Deposite Requests">
      <Container>
        <Stack>
          {/* <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}> */}
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            sx={{ mb: 2, mt: 2 }}
            alignItems="flex-end"
          >
            <Grid xs={12} item lg={6}>
              <Typography variant="h4">My Deposite Requests</Typography>
            </Grid>
            {/* <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>From</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <DesktopDatePicker
                      placeholder="From Date"
                      value={fromDate}
                      onChange={(newValue) => {
                        setFieldValue('fromDate', newValue);
                        setFromDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                </Grid> */}
            {/* <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>To</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <DesktopDatePicker
                      placeholder="To Date"
                      minDate={new Date()}
                      value={toDate}
                      onChange={(newValue) => {
                        setFieldValue('toDate', newValue);
                        setToDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                </Grid> */}
            <Grid xs={12} item lg={2} md={2} justifyContent="center">
              <LoadingButton
                variant="contained"
                color="secondary"
                sx={{ background: '#44af92', color: '#fff', py: 1 }}
                fullWidth
                onClick={() => toggleShowCreditRequestModal(true)}
              >
                New Requets
              </LoadingButton>
            </Grid>
          </Grid>
          {/* </Form>
          </FormikProvider> */}

          {/* <Grid container justifyContent="center">
            <Typography variant="h5" textAlign="center">
              Deposite Requests
            </Typography>
          </Grid> */}
          <Card sx={{ my: 0 }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center" width="50">
                      SI.No.
                    </StyledTableCell>
                    <StyledTableCell align="center" width="100">
                      Ref. No.
                    </StyledTableCell>
                    <StyledTableCell align="center" width="100">
                      Amount
                    </StyledTableCell>
                    <StyledTableCell align="center">Request Date</StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="left" width="200">
                      Remark
                    </StyledTableCell>
                    <StyledTableCell align="left" width="100">
                      Updated Date
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings &&
                    !loading &&
                    bookings.map((item, index) => (
                      <TableRow key={`booking-item-${index}`}>
                        <StyledTableCell align="center">{page * 10 + index + 1}</StyledTableCell>
                        <StyledTableCell align="center">{item.creditRef}</StyledTableCell>
                        <StyledTableCell align="center">
                          ₹{formatPrice(item.amount)}
                        </StyledTableCell>
                        <StyledTableCell align="center" width="185">
                          {format(new Date(item.requestDate), 'dd-MM-yyyy hh:mm a')}
                        </StyledTableCell>
                        <StyledTableCell align="center" width="100">
                          <Label
                            color={getStatusColor(item.status)}
                            sx={{ textTransform: 'uppercase' }}
                          >
                            {item.status}
                          </Label>
                        </StyledTableCell>
                        <StyledTableCell align="left" width="120">
                          {item.remark}
                        </StyledTableCell>

                        <StyledTableCell align="left" width="150">
                          {item.transferDate
                            ? format(new Date(item.transferDate), 'dd-MM-yyyy hh:mm a')
                            : '-'}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack sx={{ p: 2 }} dir="column">
              {loading && <TableSkeleton />}
            </Stack>
            {!loading && bookings.length <= 0 && (
              <Typography sx={{ my: 3 }} textAlign="center" variant="h5">
                No credit requests found !
              </Typography>
            )}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalBookings}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Stack>
        <CreditRequestModal />
      </Container>
    </Page>
  );
}
