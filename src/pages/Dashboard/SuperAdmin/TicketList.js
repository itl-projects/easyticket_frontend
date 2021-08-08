import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import flightIcon from '@iconify/icons-ic/baseline-flight';
import flightTackoffIcon from '@iconify/icons-ic/baseline-flight-takeoff';
import flightLandIcon from '@iconify/icons-ic/baseline-flight-land';
// material
import {
  Card,
  Container,
  Button,
  Stack,
  Typography,
  MenuItem,
  Grid,
  TextField,
  IconButton,
  InputAdornment
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
// components
import Page from '../../../components/Page';
//
import { useAdminContext } from '../../../context/AdminContext';
import TicketModal from '../../../components/Modals/TicketModal';
import AppActiveUsers from '../../../components/_dashboard/app/AppActiveUsers';
import { Tickets } from '../../../components/_adminDashboard/Tickets';

// ----------------------------------------------------------------------

export default function TicketListPage() {
  const adminContext = useAdminContext();
  const { toggleShowTicketModal } = adminContext;

  return (
    <Page title="Dashboard | Tickets">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Tickets
          </Typography>
          <Button
            variant="contained"
            onClick={toggleShowTicketModal}
            startIcon={<Icon icon={plusFill} />}
          >
            Add Ticket
          </Button>
        </Stack>

        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} lg={8} my={2}>
            <Card sx={{ px: 2, py: 3 }}>
              <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      renderInput={(params) => <TextField size="small" {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      renderInput={(params) => <TextField size="small" {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField size="small" label="Uploaded By" select fullWidth>
                    <MenuItem>Admin</MenuItem>
                    <MenuItem>Supplier</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="Airline"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Icon icon={flightIcon} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="From"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Icon icon={flightTackoffIcon} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <TextField
                    size="small"
                    fullWidth
                    type="text"
                    label="To"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <Icon icon={flightLandIcon} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4} my={2}>
            <Card sx={{ px: 2, py: 1.2 }}>
              <Grid
                columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 1 }}
                container
                direction="column"
                rowGap={1}
              >
                <Grid xs={12}>
                  <AppActiveUsers title="Admin Tickets" accualCount={24} totalCount={67} />
                </Grid>
                <Grid xs={12}>
                  <AppActiveUsers title="Supplier Tickets" accualCount={24} totalCount={67} />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ px: 0 }}>
          <Tickets />
        </Card>
      </Container>
      <TicketModal />
    </Page>
  );
}
