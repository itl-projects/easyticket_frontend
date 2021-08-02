import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Card, Link, Typography, Stack } from '@material-ui/core';

// ----------------------------------------------------------------------

BankDetailCard.propTypes = {
  detail: PropTypes.object
};

export default function BankDetailCard({ detail }) {
  const { bankName, accountHolderName, accountNumber, IFSCCode, branchName } = detail;

  return (
    <Card>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="h6" noWrap>
            {bankName}
          </Typography>
        </Link>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1">{branchName}</Typography>
        </Stack>
        <Stack direction="column" justifyContent="space-between">
          <Stack direction="row">
            <Typography variant="subtitle1">Account Holder :</Typography>
            <Typography variant="body2" ml={1}>
              {accountHolderName}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant="subtitle1">Account Number : </Typography>
            <Typography variant="body2" ml={1}>
              {accountNumber}
            </Typography>
          </Stack>
          <Stack direction="row">
            <Typography variant="subtitle1">IFSC Code:</Typography>
            <Typography variant="body2" ml={1}>
              {IFSCCode}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
