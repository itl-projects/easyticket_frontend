import * as React from 'react';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/core/Skeleton';

export default function TableSkeleton() {
  return (
    <Box sx={{ my: 2 }}>
      <Skeleton animation="wave" height={32} />
      <Skeleton animation="wave" height={32} />
      <Skeleton animation="wave" height={32} />
      <Skeleton animation="wave" height={32} />
      <Skeleton animation="wave" height={32} />
      <Skeleton animation="wave" height={32} />
    </Box>
  );
}
