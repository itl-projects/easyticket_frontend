import { Grid } from '@material-ui/core';
import React from 'react';

export default function DrawerLogo() {
  return (
    <Grid justifyContent="center" display="flex" sx={{ py: 0.2 }}>
      <img src="/static/images/header_logo.png" alt="logo" width="100%" height={68} />
    </Grid>
  );
}
