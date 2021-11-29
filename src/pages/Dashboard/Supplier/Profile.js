import { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  // Card,
  // CardHeader,
  // FormControlLabel,
  // Checkbox,
  Stack,
  Box,
  Button,
  Container,
  Avatar,
  Typography,
  Divider,
  Badge,
  IconButton,
  CircularProgress
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
import { LoadingButton } from '@material-ui/lab';
// import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import Page from '../../../components/Page';
import { useAuth } from '../../../context/AuthContext';
import { profileAPI } from '../../../services/common';
import { successMessage, errorMessage } from '../../../utils/helperFunctions';
import ChangePasswordModal from '../../../components/Modals/ChangePasswordModal';
import ProfileEditModal from '../../../components/Modals/ProfileEditModal';
import { updateUserData } from '../../../store/actions/authAction';

export default function AgentProfile() {
  // const navigate = useNavigate();
  const fileRef = useRef();
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.profile) {
      if (user.profile.profile_image) {
        const URL = process.env.REACT_APP_ASSET_ENDPOINT;
        setImage(URL + user.profile.profile_image);
      }
    }
  }, [user]);

  const [image, setImage] = useState('/static/images/avatar/1.svg');
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  // const [loadingToggleTicketLogo, setLoadingToggleTicketLogo] = useState(false);
  // const [loadingToggleTicketAmount, setLoadingToggleTicketAmount] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showInfoEditModal, setShowInfoEditModal] = useState(false);

  const filterSchema = Yup.object().shape({});

  const _inititalValues = useMemo(() => {
    if (user) {
      return {
        toggleLogo: user.ticketLogoEnabled,
        toggleAmount: user.ticketAmountEnabled
      };
    }
    return {
      toggleLogo: false,
      toggleAmount: false
    };
  }, [user]);

  const formik = useFormik({
    initialValues: _inititalValues,
    validationSchema: filterSchema
  });

  const { isSubmitting } = formik;

  const profileImageChanged = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fd = new FormData();
      fd.append('file', file);
      try {
        setUploadingProfileImage(true);
        const res = await profileAPI.changeProfileImage(fd);
        setUploadingProfileImage(false);
        if (res && res.status === 201) {
          if (res.data && res.data.success) {
            successMessage(res.data.message);
            dispatch(updateUserData(res.data.user));
            return;
          }
        }
        errorMessage(res.data?.message || 'Sorry! failed to change profile image');
      } catch (err) {
        setUploadingProfileImage(false);
        errorMessage('Sorry! failed to change profile image');
      }
    }
  };

  // const changeTicketLogoStatus = async () => {
  //   const currStatus = values.toggleLogo;
  //   try {
  //     setLoadingToggleTicketLogo(true);
  //     const res = await profileAPI.toggleTicketLogo();
  //     setLoadingToggleTicketLogo(false);
  //     if (res && res.status === 200) {
  //       if (res.data && res.data.success) {
  //         successMessage(res.data.message);
  //         dispatch(
  //           updateUserData({
  //             ...user,
  //             ticketLogoEnabled: res.data.ticketLogoStatus
  //           })
  //         );
  //         setFieldValue('toggleLogo', res.data.ticketLogoStatus);
  //         return;
  //       }
  //     }
  //     errorMessage(res.data?.message || 'Sorry! something went wrong');
  //     setFieldValue('toggleLogo', currStatus);
  //   } catch (err) {
  //     setLoadingToggleTicketLogo(false);
  //     errorMessage('Sorry! something went wrong');
  //     setFieldValue('toggleLogo', currStatus);
  //   }
  // };

  return (
    <Page title="Dashboard | Supplier" sx={{ mt: -2 }}>
      <Stack sx={{ pt: 3, pb: 6 }}>
        <Box>
          <Container sx={{ pt: 6 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate>
                <Grid container>
                  <Grid item xs={12} md={4} mt={4} textAlign="center">
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        !uploadingProfileImage ? (
                          <IconButton centerRipple onClick={() => fileRef.current.click()}>
                            <Icon
                              icon={editFill}
                              color="#ffffff"
                              style={{
                                backgroundColor: '#323232',
                                borderRadius: '50%',
                                padding: 2
                              }}
                            />
                          </IconButton>
                        ) : (
                          <CircularProgress size={20} />
                        )
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
                    <Grid container sx={{ mb: 1 }} alignItems="flex-end">
                      <Grid item xs={6}>
                        <Typography variant="h3">My Profile</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Button onClick={() => setShowInfoEditModal(true)}>Edit Info</Button>
                      </Grid>
                    </Grid>
                    <Divider sx={{ borderBottomWidth: 2, mb: 1 }} />

                    <Grid container>
                      <Grid item xs={6} md={4}>
                        <Typography sx={{ mb: 1, pl: 1 }} variant="h6">
                          Contact Person
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={8}>
                        <Typography sx={{ mb: 1, pl: 1, fontSize: 20 }} color="#8b8b8b">
                          {user?.firstName}&nbsp; {user?.lastName}
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
                          {user?.profile.company}
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
                          {user?.profile?.address}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid xs={12} item lg={12} my={6} justifyContent="center" container>
                      <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={isSubmitting}
                        fullWidth
                        onClick={() => setShowPasswordChangeModal(true)}
                      >
                        CHANGE PASSWORD
                      </LoadingButton>
                    </Grid>

                    {/* <Card>
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
                        <Stack direction="row" alignItems="center">
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...getFieldProps('toggleLogo')}
                                checked={values.toggleLogo}
                                onClick={changeTicketLogoStatus}
                              />
                            }
                            label="Hide Logo"
                          />
                          {loadingToggleTicketLogo && <CircularProgress size={20} />}
                        </Stack>
                      </Stack>
                    </Card> */}
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Container>
        </Box>
      </Stack>
      <ChangePasswordModal
        show={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
      />
      <ProfileEditModal show={showInfoEditModal} onClose={() => setShowInfoEditModal(false)} />
    </Page>
  );
}
