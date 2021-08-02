import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import { LoadingButton } from '@material-ui/lab';
import MarkupDetailList from './MarkupDetailList';
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
                label="Mark up Name"
                placeholder="Enter Mark up Name"
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
                label="Mark up Price"
                placeholder="Enter Mark up Price"
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
              <TextField label="Mark up Type" select fullWidth>
                <MenuItem>Per PAX</MenuItem>
                <MenuItem>PNR</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} lg={12} justifyContent="center">
              <LoadingButton size="large" type="submit" variant="contained">
                Add Markup
              </LoadingButton>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} lg={12}>
        <MarkupDetailList />
      </Grid>
    </Grid>
  );
}
