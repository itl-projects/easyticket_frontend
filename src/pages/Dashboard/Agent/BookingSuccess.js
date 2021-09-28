import { useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import Page from '../../../components/Page';
import { useAuth } from '../../../context/AuthContext';
import { updateUserData } from '../../../store/actions/authAction';
import { getUserData } from '../../../services/auth';

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const getUpdatedUserData = async () => {
    const res = await getUserData(user.id);
    if (res && res.status === 200) {
      if (res.data && res.data.success) {
        dispatch(updateUserData(res.data.user));
      }
    }
  };

  useEffect(() => {
    if (user) getUpdatedUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Dashboard | Booking Success">
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
