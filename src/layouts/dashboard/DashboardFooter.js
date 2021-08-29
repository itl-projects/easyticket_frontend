import { useState, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
// material
import { Grid, Typography } from '@material-ui/core';
// components

export default function DashboardFooter() {
  return (
    <Grid
      sx={{
        width: '100%',
        backgroundColor: '#daf1fe',
        height: 32,
        px: 2,
        color: '#000',
        marginLeft: 0,
        paddingTop: 0
      }}
      display="flex"
      alignItems="center"
      flexWrap="wrap"
    >
      <Grid item xs={12} lg={12} justifyContent="center" alignItems="center">
        <Typography variant="body2" textAlign="center">
          +91-12344-666-777 &nbsp; | &nbsp; +91-00-00-00-00
        </Typography>
      </Grid>
    </Grid>
  );
}
