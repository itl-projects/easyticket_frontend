import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import { LoadingButton } from '@material-ui/lab';
import BankDetailCard from './BankDetailCard';
import { bankDetails } from '../../../../_mocks_/data';
// ----------------------------------------------------------------------

export default function BankDetailList({ ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      <Grid item xs={12} lg={12}>
        <Card sx={{ px: 2, py: 3 }}>
          <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <TextField
                fullWidth
                type="text"
                label="Bank Name"
                placeholder="Enter Bank Name"
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
                label="Account Holder Name"
                placeholder="Enter Account Holder Name"
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
                label="Account Number"
                placeholder="Enter Account Number"
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
                label="IFSC Code"
                placeholder="Enter IFSC Code"
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
                label="Branch Name"
                placeholder="Enter Branch Name"
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
                Add Bank
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row" columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={3}>
          {bankDetails.map((detail, index) => (
            <Grid key={`bank-detail-${index}`} item xs={12} sm={6} md={4}>
              <BankDetailCard detail={detail} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
