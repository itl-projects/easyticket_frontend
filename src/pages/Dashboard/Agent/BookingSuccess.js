import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import successIcon from '@iconify/icons-eva/checkmark-circle-2-fill';
// import failedIcon from '@iconify/icons-eva/close-circle-fill';
import {
  Card,
  Grid,
  Button,
  Stack,
  Typography,
  CardHeader,
  Container,
  CardContent
} from '@material-ui/core';
import Page from '../../../components/Page';

export default function ConfirmBooking() {
  const navigate = useNavigate();

  return (
    <Page title="Dashboard | Booking Detail">
      <Container>
        <Grid container justifyContent="center" alignItems="center" display="flex">
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardHeader
              title="Booking Confirmation"
              sx={{ p: 1, background: '#00AB55', color: '#fff', textAlign: 'center' }}
            />
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} dir="column" justifyContent="center">
                <Grid container justifyContent="center" mt={2}>
                  <Icon icon={successIcon} width={120} height={120} color="#00AB55" />
                </Grid>

                <Typography variant="overline" textAlign="center">
                  {' '}
                  Your booking has been confirmed
                </Typography>
                <Grid container justifyContent="center" mt={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    sx={{ color: '#fff' }}
                    onClick={() => navigate('/dashboard/bookingdetail', { replace: true })}
                  >
                    VIEW TICKET
                  </Button>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Page>
  );
}
