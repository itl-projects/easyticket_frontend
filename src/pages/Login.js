import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Container, Typography, Stack, Paper } from '@material-ui/core';
// layouts
// import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
// import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import { useAuth } from '../context/AuthContext';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(() => ({
  // [theme.breakpoints.up('md')]: {
  display: 'flex',
  background: 'url(/static/images/login_bg.png) no-repeat',
  backgroundSize: 'cover'
  // }
}));

const FormStyle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 8),
  background: '#fffffff0'
  // borderRadius: '8px'
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
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#fffffff0',
              py: 2
            }}
            square
          >
            <Box
              component="img"
              src="/static/images/easyticketlogo.png"
              sx={{ width: 284, height: 72 }}
            />
          </Paper>
          <FormStyle>
            {/* <Stack sx={{ mb: 5 }}>
              <Typography variant="h4" gutterBottom>
                Sign in
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
            </Stack> */}
            <LoginForm />
            <Stack sx={{ mt: 3 }}>
              <Typography sx={{ color: 'text.secondary' }} textAlign="center">
                Don't have account?&nbsp;{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Stack>
          </FormStyle>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
