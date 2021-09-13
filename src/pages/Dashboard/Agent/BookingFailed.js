import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import failedIcon from '@iconify/icons-eva/close-circle-fill';
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
        <Grid lg={12} justifyContent="center" alignItems="center" display="flex">
          <Card variant="outlined" sx={{ width: '100%' }}>
            <CardHeader
              title="Booking Confirmation"
              sx={{ p: 1, background: 'red', color: '#fff', textAlign: 'center' }}
            />
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} dir="column" justifyContent="center">
                <Grid container justifyContent="center" mt={2}>
                  <Icon icon={failedIcon} width={120} height={120} color="#ff0033" />
                </Grid>

                <Typography variant="overline" textAlign="center">
                  {' '}
                  Sorry! Booking Failed
                </Typography>
                <Grid container justifyContent="center" mt={2}>
                  <Button
                    color="secondary"
                    variant="contained"
                    disableElevation
                    sx={{ color: '#fff' }}
                    onClick={() => navigate('/dashboard', { replace: true })}
                  >
                    TRY AGAIN
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
