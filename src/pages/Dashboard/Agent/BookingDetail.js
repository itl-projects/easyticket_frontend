import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import {
  Card,
  Grid,
  Button,
  Stack,
  Typography,
  CardHeader,
  Box,
  TableContainer,
  TableCell,
  TableRow,
  Container,
  Table,
  TableHead,
  TableBody
} from '@material-ui/core';
import { format } from 'date-fns';
import enLocale from 'date-fns/locale/en-IN';
import { styled } from '@material-ui/core/styles';
import { tableCellClasses } from '@material-ui/core/TableCell';
import { getAirlineNameById, getAirportNameById } from '../../../utils/helperFunctions';
import Page from '../../../components/Page';
import BookingPrintModal from '../../../components/Modals/BookingPrintModal';
import { useAdminContext } from '../../../context/AdminContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.common.black,
    paddingLeft: 24,
    paddingTop: 4,
    paddingRight: 24,
    paddingBottom: 4
  },
  [`&.${tableCellClasses.body}`]: {
    paddingLeft: 24,
    paddingTop: 4,
    paddingRight: 24,
    paddingBottom: 4
  }
}));

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { booking } = useSelector((state) => state.booking);
  const adminContext = useAdminContext();
  const { toggleShowBookingPrintModal } = adminContext;

  if (!booking) window.history.back();

  return (
    <Page title="Dashboard | Booking Detail">
      <Container>
        <Stack>
          <Grid display="flex" justifyContent="flex-end" container sx={{ my: 1, py: 1 }}>
            <Button
              variant="contained"
              sx={{ mr: 2, px: 4 }}
              onClick={() => navigate('/dashboard/bookedtickets', { replace: true })}
              color="warning"
              disableElevation
            >
              Go back
            </Button>
            <Button
              variant="contained"
              color="info"
              disableElevation
              onClick={() => toggleShowBookingPrintModal(true)}
              disabled={!booking.pnr}
              sx={{ px: 4 }}
            >
              Print
            </Button>
          </Grid>
          <Card sx={{ py: 1, px: 2 }}>
            <Grid container alignItems="flex-end" flexDirection="column">
              <Box
                component="img"
                src="/static/images/easyticketlogo.png"
                sx={{ width: 120, height: 28, mb: 1 }}
              />
              <Typography variant="body2">Booking Id:&nbsp;{booking.bookingRef}</Typography>
              <Typography variant="body2">
                Booked On:{' '}
                {format(new Date(booking.creationDate), 'dd-MMM-yyyy HH:mm:ss', {
                  timezone: 'Asia/Kolkata'
                })}
              </Typography>
            </Grid>
          </Card>
          <Card sx={{ py: 1, mb: 2, mt: 1, px: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <img
                  src={`/static/airways-logo/${booking.ticket.airline}.png`}
                  alt={getAirlineNameById(booking.ticket.airline)}
                  height="72"
                  width="72"
                />
              </Grid>
              <Grid item>
                <Stack dir="column" alignItems="center">
                  <Typography variant="subtitle2">
                    {getAirlineNameById(booking.ticket.airline)}
                  </Typography>
                  <Typography variant="subtitle2">{booking.ticket.flightNumber}</Typography>
                </Stack>
              </Grid>
              <Grid>
                <Stack
                  dir="column"
                  alignItems="center"
                  sx={{ border: 2, borderColor: '#f4621f', px: 3, py: 1 }}
                >
                  <Typography variant="caption">AIRLINE PNR</Typography>
                  <Typography
                    color={booking.pnr ? '#f4621f' : 'red'}
                    variant="subtitle1"
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {booking.pnr ? booking.pnr : 'Processing...'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ my: 1 }}>
            <CardHeader
              subheader={
                <Grid container justifyContent="space-between" alignItems="center" sx={{ px: 2 }}>
                  <Typography color="white" variant="body2">
                    Onward booking Detail
                  </Typography>
                  <Typography color="white" variant="body2">
                    *Please verify booking times with the airline prior to departure
                  </Typography>
                </Grid>
              }
              sx={{ p: 1, background: '#f4621f', color: '#fff' }}
            />
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Flight</StyledTableCell>
                    <StyledTableCell align="left">Departing</StyledTableCell>
                    <StyledTableCell align="left">Arriving</StyledTableCell>
                    <StyledTableCell align="left">&nbsp;</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell component="th" scope="row">
                      <Typography variant="subtitle2">
                        {getAirlineNameById(booking.ticket.airline)}
                      </Typography>
                      <Typography variant="body1">{booking.ticket.flightNumber}</Typography>

                      <Typography>{booking.bookingNumber}</Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="subtitle2">
                        {getAirportNameById(booking.ticket.source)}
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(booking.ticket.departureDateTime), 'dd-MM-yyyy HH:mm', {
                          timezone: 'Asia/Kolkata'
                        })}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="subtitle2">
                        {getAirportNameById(booking.ticket.destination)}
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(booking.ticket.arrivalDateTime), 'dd-MM-yyyy HH:mm', {
                          timezone: 'Asia/Kolkata'
                        })}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Typography variant="subtitle2">No Stop</Typography>
                      <Typography variant="subtitle2">
                        {booking.ticket.isRefundable ? 'Refundable' : 'Non-Refundable'}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Card sx={{ my: 1 }}>
            <CardHeader
              subheader="Passenger(s) Detail"
              subheaderTypographyProps={{ color: 'white', variant: 'body2' }}
              sx={{ py: 1, background: 'grey', color: '#fffff', px: 3 }}
            />
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>SI. No.</StyledTableCell>
                    <StyledTableCell align="left">Passenger(s) Name</StyledTableCell>
                    <StyledTableCell align="left">Type</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {booking.passengers.reverse().map((pass, i) => (
                    <TableRow key={`passenger-${i}`}>
                      <StyledTableCell component="th" scope="row">
                        {i + 1}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {sentenceCase(pass.title)}&nbsp;{sentenceCase(pass.firstName)}&nbsp;
                        {sentenceCase(pass.lastName)}
                      </StyledTableCell>
                      <StyledTableCell align="left">Adult</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Card sx={{ my: 1 }}>
            <CardHeader
              subheader="Booking Inclusions"
              sx={{ py: 1, px: 3 }}
              subheaderTypographyProps={{ color: '#323232', variant: 'body2' }}
            />
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Baggage</StyledTableCell>
                    <StyledTableCell align="left">Adult</StyledTableCell>
                    <StyledTableCell align="left">Child</StyledTableCell>
                    <StyledTableCell align="left">Infant</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCell component="th" scope="row">
                      Cabin Baggage
                    </StyledTableCell>
                    <StyledTableCell align="left">7 kg</StyledTableCell>
                    <StyledTableCell align="left">7 kg</StyledTableCell>
                    <StyledTableCell align="left">0 kg</StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell component="th" scope="row">
                      Check-In Baggage
                    </StyledTableCell>
                    <StyledTableCell align="left">15 kg</StyledTableCell>
                    <StyledTableCell align="left">15 kg</StyledTableCell>
                    <StyledTableCell align="left">0 kg</StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Grid container sx={{ mt: 2 }}>
            <Grid item display="flex" justifyContent="center" xs={12} alignItems="center">
              <Typography variant="overline" textAlign="center" sx={{ fontSize: 18 }}>
                Important Information
              </Typography>
            </Grid>
            <Grid item display="flex" justifyContent="start" lg={12} sx={{ mt: 3 }}>
              <Typography variant="body2">
                1. This ticket is Non Refundable & Non Changeable.
                <br /> 2. All Guests, including children and infants, must present valid
                identification at check-in.
                <br /> 3. As per government directives, Web Check-in is mandatory for all passengers
                before the scheduled departure of their domestic booking. Charges apply*
                <br /> 4. Check-in begins 3 hours prior to the booking for seat assignment and
                closes 45 minutes prior to the scheduled departure.
                <br />
                5. Charged fare is totally agreed between "BUYER & SELLER", any issues related to
                fares thereafter will not be entertained.
                <br />
                6. We are not responsible for any booking delay/Cancellation from airline's end.
                kindly contact the airline at least 24 hrs before to reconfirm your booking detail
                giving reference of Airline PNR Number. For any schedule change, booking cancelled &
                terminal related issues.
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Container>
      <BookingPrintModal />
    </Page>
  );
}
