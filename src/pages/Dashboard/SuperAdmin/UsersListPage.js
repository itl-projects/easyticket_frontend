import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
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

  useEffect(() => {
    if (!showAgentModal) getUsersCounts();
  }, [showAgentModal]);

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
            <Card sx={{ px: 2, py: 3 }}>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    fullWidth
                    size="small"
                    type="text"
                    label="Ref ID"
                    placeholder="Enter Ref ID"
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
                  <TextField size="small" label="User Type" select fullWidth value="all">
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="agent">Agent</MenuItem>
                    <MenuItem value="supplier">Supplier</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField size="small" label="Status" select fullWidth value="all">
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">In Active</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField size="small" label="City" select fullWidth>
                    <MenuItem>option</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField size="small" label="State" select fullWidth>
                    <MenuItem>option</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Phone Number"
                    placeholder="Enter Phone Number"
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
          <UsersListTable />
        </Card>
      </Container>
      <AddAgentModal />
    </Page>
  );
}
