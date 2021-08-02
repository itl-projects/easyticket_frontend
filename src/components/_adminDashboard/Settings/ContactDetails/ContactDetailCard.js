import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Link, Typography, Stack } from '@material-ui/core';

// ----------------------------------------------------------------------

BankDetailCard.propTypes = {
  index: PropTypes.number,
  detail: PropTypes.object
};

export default function BankDetailCard({ detail, index }) {
  const { phoneNumber, address } = detail;

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="h6" noWrap>
            {index + 1}
          </Typography>
        </Link>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1">{phoneNumber}</Typography>
        </Stack>
        <Stack direction="column" justifyContent="space-between">
          <Typography variant="subtitle1">Address :</Typography>
          <Typography variant="body2">{address}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
