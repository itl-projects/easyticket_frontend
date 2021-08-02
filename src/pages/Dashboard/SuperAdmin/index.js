import { useState } from 'react';
import { Card, Container, Box, Tab, Tabs } from '@material-ui/core';
// components
import { PendingRequests } from '../../../components/_adminDashboard/Requests';
import Page from '../../../components/Page';
import UpdatePNRModal from '../../../components/Modals/UpdatePNRModal';

// ----------------------------------------------------------------------

export default function AdminDasboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Dashboard | Pending Requests">
      <Container>
        <Box sx={{ mb: 2 }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Pending Requests" />
          </Tabs>
        </Box>
        <Card>
          <PendingRequests />
        </Card>
        <UpdatePNRModal />
      </Container>
    </Page>
  );
}
