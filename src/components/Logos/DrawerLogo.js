import { Grid } from '@material-ui/core';
import React from 'react';

export default function DrawerLogo() {
  return (
    <Grid justifyContent="center" display="flex" sx={{ pt: 0 }}>
      <img src="/static/images/easyticketlogo.png" alt="logo" width="100%" height={72} />
    </Grid>
  );
}
