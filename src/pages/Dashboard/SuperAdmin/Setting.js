import { useState } from 'react';
// material
import { Container, Box, Tabs, Tab } from '@material-ui/core';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
// components
import Page from '../../../components/Page';
import BankDetailList from '../../../components/_adminDashboard/Settings/BankDetails';
import ContactDetailList from '../../../components/_adminDashboard/Settings/ContactDetails';
import MarkupDetailList from '../../../components/_adminDashboard/Settings/Markups';

// ----------------------------------------------------------------------

export default function SeetingsPage() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Dashboard | Settings">
      <Container>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Bank Details" value="1" />
              <Tab label="Mark up" value="2" />
              <Tab label="Contact" value="3" />
            </Tabs>
          </Box>
          <TabPanel value="1">
            <BankDetailList />
          </TabPanel>
          <TabPanel value="2">
            <MarkupDetailList />
          </TabPanel>
          <TabPanel value="3">
            <ContactDetailList />
          </TabPanel>
        </TabContext>
      </Container>
    </Page>
  );
}
