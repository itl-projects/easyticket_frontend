import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import successIcon from '@iconify/icons-eva/checkmark-circle-2-fill';
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
import { styled } from '@material-ui/core/styles';
import Page from '../components/Page';
import { removeRegistrationStatus } from '../store/actions/globalAction';

const RootStyle = styled(Page)(() => ({
  // [theme.breakpoints.up('md')]: {
  display: 'flex',
  background: 'url(/static/images/login_bg.png) no-repeat',
  backgroundSize: 'cover'
  // }
}));

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registrationStatus } = useSelector((state) => state.global);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(removeRegistrationStatus()), []);

  if (!registrationStatus) {
    navigate('/login', { replace: true });
  }

  return (
    <RootStyle title="Registration success">
      <Container maxWidth="md">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          display="flex"
          sx={{ minHeight: '100vh' }}
        >
          <Card variant="outlined" sx={{ width: '100%', background: '#fffffff0' }}>
            <CardHeader
              title="Registration Successfull"
              sx={{ p: 1, backgroundColor: '#00AB55', color: '#fff', textAlign: 'center' }}
            />
            <CardContent sx={{ p: 4, background: '#fffffff0' }}>
              <Stack spacing={3} dir="column" justifyContent="center">
                <Grid container justifyContent="center" mt={2}>
                  <Icon icon={successIcon} width={120} height={120} color="#00AB55" />
                </Grid>
                <Typography variant="button" textAlign="center">
                  Your account has been created successfully!.
                </Typography>
                <Typography variant="overline" textAlign="center">
                  Please contact administrator to activate your account.
                </Typography>
                <Grid container justifyContent="center" mt={2}>
                  <Button
                    color="primary"
                    variant="contained"
                    disableElevation
                    sx={{ color: '#fff', minWidth: 200 }}
                    onClick={() => navigate('/login', { replace: true })}
                  >
                    login page
                  </Button>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </RootStyle>
  );
}
