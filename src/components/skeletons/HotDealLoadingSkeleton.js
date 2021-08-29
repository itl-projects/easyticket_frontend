import * as React from 'react';
import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/core/Skeleton';

export default function HotDealLoadingSkeleton() {
  return (
    <Box
      sx={{
        px: 2,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '100%'
      }}
    >
      <Skeleton animation="wave" height={100} width={150} />
      <Skeleton animation="wave" height={100} width={150} />
      <Skeleton animation="wave" height={100} width={150} />
      <Skeleton animation="wave" height={100} width={150} />
      <Skeleton animation="wave" height={100} width={150} />
      <Skeleton animation="wave" height={100} width={150} />
    </Box>
  );
}
