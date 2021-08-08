import PropTypes from 'prop-types';
// material
import { styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(0.4, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.grey[100]
}));

// ----------------------------------------------------------------------

AppActiveUsers.propTypes = {
  title: PropTypes.string,
  accualCount: PropTypes.number,
  totalCount: PropTypes.number
};

export default function AppActiveUsers({ title, accualCount, totalCount }) {
  return (
    <RootStyle>
      <Typography variant="h4" mb={0}>
        {accualCount}/{totalCount}
      </Typography>
      <Typography sx={{ opacity: 0.72 }} variant="overline" display="block">
        Total {title}
      </Typography>
    </RootStyle>
  );
}
