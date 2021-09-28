import { Grid, Card, Stack, Typography, Button } from '@material-ui/core';
import PropsType from 'prop-types';
import { format } from 'date-fns';
import {
  getAirlineNameById,
  getAirportNameById,
  getDateDuration,
  formatPrice
} from '../utils/helperFunctions';
import { useAuth } from '../context/AuthContext';
import { useAdminContext } from '../context/AdminContext';

TicketListCard.propTypes = {
  item: PropsType.object,
  onClick: PropsType.func
};

export default function TicketListCard({ item, onClick }) {
  const { user } = useAuth();
  const adminContext = useAdminContext();
  const { setShowAlertInfo } = adminContext;

  const checkAndForward = () => {
    if (user.commision < item.price) {
      setShowAlertInfo({
        title: 'Low Balance',
        message: `You need ₹${formatPrice(
          item.price - user.commision
        )} more amount to book this ticket.`
      });
    } else onClick(item);
  };

  return (
    <Card sx={{ p: 1, mb: 2 }} key={item.id}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <img
            src={`/static/airways-logo/${item.airline}.png`}
            alt={getAirlineNameById(item.airline)}
            height="72"
            width="72"
          />
        </Grid>
        <Grid item>
          <Stack dir="column" alignItems="center">
            <Typography variant="subtitle2">{getAirlineNameById(item.airline)}</Typography>
            <Typography>{item.flightNumber}</Typography>
          </Stack>
        </Grid>
        <Grid>
          <Stack dir="column" alignItems="center">
            <Typography variant="subtitle2">{getAirportNameById(item.source)}</Typography>
            <Typography>
              {format(new Date(item.departureDateTime), 'HH:mm', {
                timeZone: 'Asia/Kolkata'
              })}
            </Typography>
          </Stack>
        </Grid>
        <Grid>
          <Typography>
            {getDateDuration(new Date(item.departureDateTime), new Date(item.arrivalDateTime))}
          </Typography>
        </Grid>
        <Grid>
          <Stack dir="column" alignItems="center">
            <Typography variant="subtitle2">{getAirportNameById(item.destination)}</Typography>
            <Typography>{format(new Date(item.arrivalDateTime), 'HH:mm')}</Typography>
          </Stack>
        </Grid>
        <Grid>
          <Typography>{item.isRefundable ? 'Refundable' : 'Non-Refundable'}</Typography>
        </Grid>
        <Grid xs={2} item>
          {item.price ? (
            <Stack dir="column" spacing={1}>
              <Card sx={{ p: 1, textAlign: 'center', backgroundColor: '#f4f4f4f0' }} elevation={0}>
                ₹ {formatPrice(item.price)}
              </Card>
              <Button
                variant="contained"
                color="secondary"
                sx={{ background: '#44af92', color: 'white' }}
                onClick={checkAndForward}
              >
                BOOK
              </Button>
              {user.commision < item.price && (
                <Typography color="red" variant="caption">
                  * Require ₹{formatPrice(item.price - user.commision)} more to book
                </Typography>
              )}
            </Stack>
          ) : (
            <Stack dir="column" spacing={1}>
              <Card
                sx={{
                  p: 1,
                  textAlign: 'center',
                  backgroundColor: 'orange',
                  maxWidth: 240
                }}
                elevation={0}
              >
                <Typography color="white">{item.note}</Typography>
              </Card>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}
