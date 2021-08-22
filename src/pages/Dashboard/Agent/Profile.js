import { useRef, useState } from 'react';
import {
  Grid,
  Card,
  Stack,
  Box,
  Container,
  Avatar,
  Typography,
  Divider,
  CardHeader,
  Badge,
  FormControlLabel,
  Checkbox,
  IconButton
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import { LoadingButton } from '@material-ui/lab';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Page from '../../../components/Page';
import { useAuth } from '../../../context/AuthContext';

export default function AgentProfile() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const { user } = useAuth();

  const [image, setImage] = useState('/static/images/avatar/1.svg');

  const filterSchema = Yup.object().shape({
    departureDateTime: Yup.date().required('Departure datetime is required'),
    source: Yup.number().required('Source is required'),
    destination: Yup.number()
      .required('Destination is required')
      .notOneOf([Yup.ref('source'), null], 'Source and destination cannot be same'),
    quantity: Yup.number().typeError('Please enter only numbers').positive()
  });

  const formik = useFormik({
    initialValues: {
      source: '',
      destination: '',
      quantity: '1'
    },
    validationSchema: filterSchema,
    onSubmit: async () => {
      navigate('/dashboard/searchTicket', { replace: false, state: { ...values } });
    }
  });

  const { values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const profileImageChanged = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Page title="Dashboard | Agent" sx={{ mt: -2 }}>
      <Stack>
        <Box>
          <Container sx={{ pt: 6 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Typography variant="h3" textAlign="center" sx={{ mb: 4 }}>
                  My Profile
                </Typography>
                <Grid container>
                  <Grid item xs={12} md={4} mt={4} textAlign="center">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <IconButton centerRipple onClick={() => fileRef.current.click()}>
                          <Icon
                            icon={editFill}
                            color="#ffffff"
                            style={{ backgroundColor: '#323232', borderRadius: '50%', padding: 2 }}
                          />
                        </IconButton>
                      }
                    >
                      <Avatar alt="profile image" src={image} sx={{ width: 180, height: 180 }} />
                      <input
                        type="file"
                        hidden
                        onChange={profileImageChanged}
                        ref={fileRef}
                        accept="image/*"
                      />
                    </Badge>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Divider sx={{ borderBottomWidth: 2, mb: 1 }} />

                    <Grid container>
                      <Grid item xs={6} md={4}>
                        <Typography sx={{ mb: 1, pl: 1 }} variant="h6">
                          Contact Person
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={8}>
                        <Typography sx={{ mb: 1, pl: 1, fontSize: 20 }} color="#8b8b8b">
                          Biswajit Saha
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider variant="fullWidth" sx={{ mb: 1 }} />
                    <Grid container>
                      <Grid item xs={6} md={4}>
                        <Typography sx={{ mb: 1, pl: 1 }} variant="h6">
                          Company Name
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={8}>
                        <Typography sx={{ mb: 1, pl: 1, fontSize: 20 }} color="#8b8b8b">
                          EASYTICKET
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider variant="fullWidth" sx={{ mb: 1 }} />
                    <Grid container>
                      <Grid item xs={6} md={4}>
                        <Typography sx={{ mb: 1, pl: 1 }} variant="h6">
                          Email
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={8}>
                        <Typography sx={{ mb: 1, pl: 1, fontSize: 20 }} color="#8b8b8b">
                          {user?.email}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider variant="fullWidth" sx={{ mb: 1 }} />
                    <Grid container>
                      <Grid item xs={6} md={4}>
                        <Typography sx={{ mb: 1, pl: 1 }} variant="h6">
                          Mobile
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={8}>
                        <Typography sx={{ mb: 1, pl: 1, fontSize: 20 }} color="#8b8b8b">
                          {user?.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider variant="fullWidth" sx={{ mb: 1 }} />
                    <Grid container>
                      <Grid item xs={6} md={4}>
                        <Typography sx={{ mb: 1, pl: 1 }} variant="h6">
                          Address
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={8}>
                        <Typography sx={{ mb: 1, pl: 1, fontSize: 20 }} color="#8b8b8b">
                          address info
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={12} item lg={12} my={6} justifyContent="center" container>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        fullWidth
                      >
                        CHANGE PASSWORD
                      </LoadingButton>
                    </Grid>

                    <Card>
                      <CardHeader
                        title="Invoice Setting"
                        titleTypographyProps={{
                          backgroundColor: '#00AB55',
                          px: 2,
                          py: 1,
                          color: 'white',
                          textAlign: 'center',
                          variant: 'body1'
                        }}
                        sx={{ p: 0 }}
                      />

                      <Stack sx={{ pl: 4, py: 1 }}>
                        <FormControlLabel
                          control={<Checkbox {...getFieldProps('agree')} checked={values.agree} />}
                          label="Hide Logo"
                        />
                        <FormControlLabel
                          control={<Checkbox {...getFieldProps('agree')} checked={values.agree} />}
                          label="Hide Amount"
                        />
                      </Stack>
                    </Card>
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Container>
        </Box>
      </Stack>
    </Page>
  );
}
