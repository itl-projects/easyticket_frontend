import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Card,
  Grid,
  Button,
  Stack,
  Typography,
  TableContainer,
  TableCell,
  TableRow,
  Container,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@material-ui/core';
import { format } from 'date-fns';
import { styled } from '@material-ui/core/styles';
import { tableCellClasses } from '@material-ui/core/TableCell';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { DesktopDatePicker, LoadingButton } from '@material-ui/lab';
import enLocale from 'date-fns/locale/en-IN';
import Label from '../../../components/Label';
import Page from '../../../components/Page';
import { bookingsAPI } from '../../../services/agent';
import { TableSkeleton } from '../../../components/skeletons';
import { formatPrice, getAirlineNameById } from '../../../utils/helperFunctions';
import { setBookingData, removeBookingData } from '../../../store/actions/bookingAction';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.common.black,
    paddingLeft: 8,
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4,
    fontSize: 12,
    textTransform: 'capitalize'
  },
  [`&.${tableCellClasses.body}`]: {
    paddingLeft: 8,
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4
  }
}));

export default function ConfirmBooking() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
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
    onSubmit: async () => {
      // navigate('/dashboard/searchTicket', { replace: false, state: { ...values } });
      getMyBookings();
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getMyBookings = async () => {
    setLoading(true);
    const data = {
      page: page + 1,
      limit: rowsPerPage,
      bookingRef: values.bookingRef,
      fromDate: values.fromDate,
      toDate: values.toDate,
      travelDate: values.travelDate,
      pnr: values.pnr
    };
    const res = await bookingsAPI.getBookings(data);
    setLoading(false);
    if (res && res.status === 201) {
      setTotalBookings(res.data.data.meta.totalItems);
      setBookings(res.data.data.items);
    }
  };

  useEffect(() => {
    getMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  useEffect(() => {
    dispatch(removeBookingData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewBookingDetail = (bookedItem) => {
    dispatch(setBookingData(bookedItem));
    setTimeout(() => {
      navigate('/dashboard/bookingdetail', { replace: false });
    }, 120);
  };

  return (
    <Page title="Dashboard | Booking Detail">
      <Container>
        <Stack>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mb: 6, mt: 2 }}
                alignItems="flex-end"
              >
                <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>PNR</Typography>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="PNR"
                    {...getFieldProps('pnr')}
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    size="small"
                  />
                </Grid>
                <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>Booking Ref</Typography>
                  <TextField
                    fullWidth
                    type="text"
                    placeholder="Booking Ref"
                    {...getFieldProps('bookingRef')}
                    error={Boolean(touched.quantity && errors.quantity)}
                    helperText={touched.quantity && errors.quantity}
                    size="small"
                  />
                </Grid>
                <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>From Date</Typography>
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
                </Grid>
                <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>To Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <DesktopDatePicker
                      placeholder="To Date"
                      value={toDate}
                      onChange={(newValue) => {
                        setFieldValue('toDate', newValue);
                        setToDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} item lg={2} md={2}>
                  <Typography sx={{ mb: 1, pl: 1 }}>Travel Date</Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
                    <DesktopDatePicker
                      placeholder="Travel Date"
                      minDate={new Date()}
                      value={travelDate}
                      onChange={(newValue) => {
                        setFieldValue('travelDate', newValue);
                        setTravelDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} item lg={2} md={2} justifyContent="center">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ background: '#44af92', color: '#fff', py: 1 }}
                    loading={isSubmitting}
                    fullWidth
                  >
                    Filter Bookings
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>

          <Grid container justifyContent="center">
            <Typography variant="h5" textAlign="center">
              My Bookings
            </Typography>
          </Grid>
          <Card sx={{ my: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">SI.No.</StyledTableCell>
                    <StyledTableCell align="center">Booking Ref</StyledTableCell>
                    <StyledTableCell align="center">Booking Date</StyledTableCell>
                    <StyledTableCell align="center">Airline</StyledTableCell>
                    <StyledTableCell align="left">Travel Date</StyledTableCell>
                    <StyledTableCell align="left">Pax Name</StyledTableCell>
                    <StyledTableCell align="center">PNR</StyledTableCell>
                    <StyledTableCell align="center">Booking Amount</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings &&
                    !loading &&
                    bookings.map((item, index) => (
                      <TableRow key={`booking-item-${index}`}>
                        <StyledTableCell align="center">{page * 10 + index + 1}</StyledTableCell>
                        <StyledTableCell align="center">{item.bookingRef}</StyledTableCell>
                        <StyledTableCell align="center" width="185">
                          {format(
                            new Date(new Date(item.creationDate.replace(/(....Z)/, ''))),
                            'dd-MM-yyyy HH:mm:ss',
                            {
                              timeZone: 'Asia/Kolkata'
                            }
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center" width="120">
                          {getAirlineNameById(item.ticket.airline)}
                        </StyledTableCell>
                        <StyledTableCell align="left" width="150">
                          {format(new Date(item.ticket.departureDateTime), 'dd-MM-yyyy HH:mm', {
                            timeZone: 'Asia/Kolkata'
                          })}
                        </StyledTableCell>
                        <StyledTableCell align="left" width="180">
                          {/* <ul> */}
                          <List dense sx={{ py: 0 }}>
                            {item.passengers.map((el, i) => (
                              <ListItem
                                key={`${el.title} ${el.firstName} ${el.firstName}-${i}`}
                                disableGutters
                                disablePadding
                              >
                                <ListItemText
                                  sx={{ textTransform: 'capitalize' }}
                                  primary={`${el.title}. ${el.firstName} ${el.lastName}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                          {/* {item.passengers.map((el, i) => (
                              <li key={`${el.title} ${el.firstName} ${el.firstName}-${i}`}>
                                {sentenceCase(`${el.title} ${el.firstName} ${el.lastName}`)}
                              </li>
                            ))} */}
                          {/* </ul> */}
                        </StyledTableCell>
                        <StyledTableCell align="center" width="100">
                          <Label
                            color={item.pnr ? 'success' : 'error'}
                            sx={{ textTransform: 'uppercase' }}
                          >
                            {item.pnr ? item.pnr : 'Pending'}
                          </Label>
                        </StyledTableCell>
                        <StyledTableCell align="center" width="120">
                          ₹ {formatPrice(item.amount)}
                        </StyledTableCell>
                        <StyledTableCell align="center" width="100">
                          <Button onClick={() => viewBookingDetail(item)}>View</Button>
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
                No bookings found !
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
      </Container>
    </Page>
  );
}
