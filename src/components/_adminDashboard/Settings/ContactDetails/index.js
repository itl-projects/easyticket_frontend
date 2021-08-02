import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import { LoadingButton } from '@material-ui/lab';
import BankDetailCard from './ContactDetailCard';
import { contacts } from '../../../../_mocks_/data';
// ----------------------------------------------------------------------

export default function ContactDetailList({ ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      <Grid item xs={12} lg={12}>
        <Card sx={{ px: 2, py: 3 }}>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
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
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                fullWidth
                type="text"
                label="Address"
                placeholder="Enter Address"
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
            <Grid item xs={12} lg={4} alignItems="center">
              <LoadingButton fullWidth size="large" type="submit" variant="contained">
                Add Contact
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Grid container direction="row" columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
          {contacts.map((detail, index) => (
            <Grid key={`bank-detail-${index}`} item xs={12} sm={6} md={4}>
              <BankDetailCard detail={detail} index={index} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
