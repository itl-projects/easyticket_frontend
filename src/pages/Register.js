import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Card, Box, Container, Typography, Stack } from '@material-ui/core';
// layouts
// import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
// import { MHidden } from '../components/@material-extend';
import RegisterForm from '../components/Forms/RegisterForm';
import { useAuth } from '../context/AuthContext';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(() => ({
  // [theme.breakpoints.up('md')]: {
  display: 'flex',
  background: 'url(/static/images/login_bg.png) no-repeat',
  backgroundSize: 'cover'
  // }
}));

const FormStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4, 8),
  background: '#fffffff0'
  // borderRadius: '8px'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  // maxWidth: theme.breakpoints.values.md ? '80vw' : '80vw',
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <RootStyle title="Register | Easy Ticket">
      <Container maxWidth="md">
        <ContentStyle>
          <Card
            elvation={0}
            raised={false}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#fffffff0',
              py: 2
            }}
          >
            <Box
              component="img"
              src="/static/images/easyticketlogo.png"
              sx={{ width: 284, height: 72 }}
            />
          </Card>
          <Stack sx={{ backgroundColor: '#fffffff0', pb: 2, pt: 1 }}>
            <Typography variant="h4" gutterBottom textAlign="center" mb={0}>
              Registration Form
            </Typography>
            <Typography sx={{ color: 'text.secondary' }} textAlign="center">
              Enter your details below.
            </Typography>
          </Stack>
          <FormStyle>
            <RegisterForm />
          </FormStyle>
          <Stack sx={{ backgroundColor: '#fffffff0', pb: 2, pt: 1 }}>
            <Typography sx={{ color: 'text.secondary' }} textAlign="center">
              Already have account?&nbsp;{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Login here
              </Link>
            </Typography>
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
