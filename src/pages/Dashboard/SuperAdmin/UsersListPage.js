import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  MenuItem,
  Grid,
  TextField
} from '@material-ui/core';
// components
import Page from '../../../components/Page';
//
import { useAdminContext } from '../../../context/AdminContext';
import AddAgentModal from '../../../components/Modals/AddAgentModal';
import AppActiveUsers from '../../../components/_dashboard/app/AppActiveUsers';
import { UsersListTable } from '../../../components/_adminDashboard/Users';
import { usersAPI } from '../../../services/admin';

// ----------------------------------------------------------------------

export default function UserListPage() {
  const adminContext = useAdminContext();
  const { toggleShowAgentModal, showAgentModal } = adminContext;
  const [totalAgents, setTotalAgents] = useState(0);
  const [totalActiveAgents, setTotalActiveAgents] = useState(0);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalActiveSuppliers, setTotalActiveSuppliers] = useState(0);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  const getUsersCounts = async () => {
    const res = await usersAPI.getUsersCounts();
    if (res && res.status === 200) {
      if (res.data.success) {
        setTotalAgents(res.data.data.agents.total);
        setTotalActiveAgents(res.data.data.agents.active);
        setTotalSuppliers(res.data.data.suppliers.total);
        setTotalActiveSuppliers(res.data.data.suppliers.active);
      }
    }
  };

  const getCities = async () => {
    const res = await usersAPI.getCities();
    if (res && res.status === 200) {
      if (res.data.success) {
        setCities(res.data.data);
      }
    }
  };

  const getStates = async () => {
    const res = await usersAPI.getStates();
    if (res && res.status === 200) {
      if (res.data.success) {
        setStates(res.data.data);
      }
    }
  };

  useEffect(() => {
    getCities();
    getStates();
  }, []);

  useEffect(() => {
    if (!showAgentModal) getUsersCounts();
  }, [showAgentModal]);

  const userListFilterSchema = Yup.object().shape({
    userRef: Yup.string(),
    phone: Yup.string(),
    status: Yup.number(),
    city: Yup.string(),
    state: Yup.string(),
    userType: Yup.number()
  });

  const formik = useFormik({
    initialValues: {
      userRef: '',
      phone: '',
      status: -1,
      city: 'all',
      state: 'all',
      userType: 0
    },
    validationSchema: userListFilterSchema,
    onSubmit: async () => {}
  });

  const { values, getFieldProps } = formik;

  return (
    <Page title="Dashboard | Users">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            USERS
          </Typography>
          <Button
            variant="contained"
            onClick={toggleShowAgentModal}
            startIcon={<Icon icon={plusFill} />}
          >
            Add User
          </Button>
        </Stack>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} lg={8} my={2}>
            <FormikProvider value={formik}>
              <Form>
                <Card sx={{ px: 2, py: 3 }}>
                  <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        fullWidth
                        size="small"
                        type="text"
                        label="Ref ID"
                        placeholder="Enter Ref ID"
                        {...getFieldProps('userRef')}
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment position="end">
                        //       <IconButton edge="end">
                        //         <Icon icon={commisionIcon} />
                        //       </IconButton>
                        //     </InputAdornment>
                        //   )
                        // }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        type="number"
                        size="small"
                        label="User Type"
                        select
                        fullWidth
                        {...getFieldProps('userType')}
                      >
                        <MenuItem value={0}>All</MenuItem>
                        <MenuItem value={1}>Agent</MenuItem>
                        <MenuItem value={3}>Supplier</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        type="number"
                        size="small"
                        label="Status"
                        select
                        fullWidth
                        {...getFieldProps('status')}
                      >
                        <MenuItem value={-1}>All</MenuItem>
                        <MenuItem value={1}>Active</MenuItem>
                        <MenuItem value={0}>In Active</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        size="small"
                        label="City"
                        select
                        fullWidth
                        {...getFieldProps('city')}
                      >
                        <MenuItem value="all">All</MenuItem>
                        {cities &&
                          cities.map((el) => (
                            <MenuItem key={el.city} value={el.city}>
                              {el.city}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        size="small"
                        label="State"
                        select
                        fullWidth
                        {...getFieldProps('state')}
                      >
                        <MenuItem value="all">All</MenuItem>
                        {states &&
                          states.map((el) => (
                            <MenuItem key={el.state} value={el.state}>
                              {el.state}
                            </MenuItem>
                          ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                      <TextField
                        size="small"
                        fullWidth
                        type="text"
                        label="Phone Number"
                        placeholder="Enter Phone Number"
                        {...getFieldProps('phone')}
                        // InputProps={{
                        //   endAdornment: (
                        //     <InputAdornment position="end">
                        //       <IconButton edge="end">
                        //         <Icon icon={commisionIcon} />
                        //       </IconButton>
                        //     </InputAdornment>
                        //   )
                        // }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Form>
            </FormikProvider>
          </Grid>
          <Grid item xs={12} lg={4} my={2}>
            <Card sx={{ px: 2, py: 1.2 }}>
              <Grid
                // columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 1 }}
                container
                direction="column"
                rowGap={1}
              >
                <Grid>
                  <AppActiveUsers
                    title="Active Agents"
                    accualCount={totalActiveAgents}
                    totalCount={totalAgents}
                  />
                </Grid>
                <Grid>
                  <AppActiveUsers
                    title="Active Suppliers"
                    accualCount={totalActiveSuppliers}
                    totalCount={totalSuppliers}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <UsersListTable filters={values} />
        </Card>
      </Container>
      <AddAgentModal />
    </Page>
  );
}
