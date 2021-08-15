import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sentenceCase } from 'change-case';
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
  TablePagination
} from '@material-ui/core';
import { format } from 'date-fns';
import { styled } from '@material-ui/core/styles';
import { tableCellClasses } from '@material-ui/core/TableCell';
import Label from '../../../components/Label';
import Page from '../../../components/Page';
import { bookingsAPI } from '../../../services/agent';
import { TableSkeleton } from '../../../components/skeletons';
import { getAirlineNameById } from '../../../utils/helperFunctions';
import { setBookingData, removeBookingData } from '../../../store/actions/bookingAction';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.common.black,
    paddingLeft: 24,
    paddingTop: 4,
    paddingRight: 24,
    paddingBottom: 4,
    fontSize: 12,
    textTransform: 'capitalize'
  },
  [`&.${tableCellClasses.body}`]: {
    paddingLeft: 24,
    paddingTop: 4,
    paddingRight: 24,
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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getMyBookings = async () => {
    setLoading(true);
    const res = await bookingsAPI.getBookings(page + 1, rowsPerPage);
    setLoading(false);
    if (res && res.status === 200) {
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
                    <StyledTableCell align="left">Date</StyledTableCell>
                    <StyledTableCell align="left">Airline</StyledTableCell>
                    <StyledTableCell align="left">Travel Date</StyledTableCell>
                    <StyledTableCell align="left">Pax Name</StyledTableCell>
                    <StyledTableCell align="center">PNR</StyledTableCell>
                    <StyledTableCell align="left">Booking Amount</StyledTableCell>
                    <StyledTableCell align="center">Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings &&
                    !loading &&
                    bookings.map((item, index) => (
                      <TableRow key={`booking-item-${index}`}>
                        <StyledTableCell align="left">{page * 10 + index + 1}</StyledTableCell>
                        <StyledTableCell align="left">{item.bookingRef}</StyledTableCell>
                        <StyledTableCell align="left" width="185">
                          {format(new Date(item.creationDate), 'dd-MM-yyyy HH:mm::ss')}
                        </StyledTableCell>
                        <StyledTableCell align="left" width="120">
                          {getAirlineNameById(item.ticket.airline)}
                        </StyledTableCell>
                        <StyledTableCell align="left" width="180">
                          {format(new Date(item.ticket.departureDateTime), 'dd-MM-yyyy HH:mm')}
                        </StyledTableCell>
                        <StyledTableCell align="left" width="180">
                          <ul>
                            {item.passengers.map((el, i) => (
                              <li key={`${el.title} ${el.firstName} ${el.firstName}-${i}`}>
                                {sentenceCase(`${el.title} ${el.firstName} ${el.lastName}`)}
                              </li>
                            ))}
                          </ul>
                        </StyledTableCell>
                        <StyledTableCell align="left" width="100">
                          <Label color={item.pnr ? 'success' : 'error'}>
                            {item.pnr ? item.pnr : 'Pending'}
                          </Label>
                        </StyledTableCell>
                        <StyledTableCell align="left">₹ {item.amount}</StyledTableCell>
                        <StyledTableCell align="center">
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
            {bookings.length <= 0 && (
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
