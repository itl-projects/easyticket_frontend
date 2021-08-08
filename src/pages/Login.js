import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Card, Stack, Container, Typography } from '@material-ui/core';
// layouts
// import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
// import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import { useAuth } from '../context/AuthContext';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  // [theme.breakpoints.up('md')]: {
  display: 'flex',
  background: 'url(/static/images/login_bg.png) no-repeat',
  backgroundSize: 'cover'
  // }
}));

const FormStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(8, 8),
  background: '#fffffff0',
  borderRadius: '8px'
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <RootStyle title="Login | Easy Ticket">
      {/* <AuthLayout /> */}

      {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}

      <Container maxWidth="sm">
        <ContentStyle>
          <FormStyle>
            <Stack sx={{ mb: 5 }}>
              <Typography variant="h4" gutterBottom>
                Sign in
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
            </Stack>
            <LoginForm />
          </FormStyle>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
