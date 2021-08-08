import { Stack, Skeleton, Card, Grid } from '@material-ui/core';

export default function FlightListSpinner() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Stack sx={{ mt: 2, px: 6 }} key={`flight-spinner-${i + 1}`}>
          <Card sx={{ px: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <Skeleton variant="rectangular" width={72} height={72} />
              </Grid>
              <Grid flexDirection="column">
                <Stack dir="column" spacing={1}>
                  <Skeleton variant="text" width={72} height={18} />
                  <Skeleton variant="text" width={72} height={18} />
                </Stack>
              </Grid>
              <Grid>
                <Stack dir="column" spacing={1}>
                  <Skeleton variant="text" width={72} height={18} />
                  <Skeleton variant="text" width={72} height={18} />
                </Stack>
              </Grid>
              <Grid>
                <Skeleton variant="text" width={92} height={18} />
              </Grid>
              <Grid>
                <Stack dir="column" spacing={1}>
                  <Skeleton variant="text" width={72} height={18} />
                  <Skeleton variant="text" width={72} height={18} />
                </Stack>
              </Grid>
              <Grid>
                <Skeleton variant="text" width={92} height={18} />
              </Grid>
              <Grid>
                <Stack dir="column">
                  <Skeleton variant="text" width={180} height={48} />
                  <Skeleton variant="text" width={180} height={48} />
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      ))}
    </>
  );
}
