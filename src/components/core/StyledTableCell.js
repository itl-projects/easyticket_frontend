import { TableCell } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { tableCellClasses } from '@material-ui/core/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.common.black,
    paddingLeft: 8,
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4,
    fontSize: 12,
    textTransform: 'capitalize'
  },
  [`&.${tableCellClasses.body}`]: {
    paddingLeft: 8,
    paddingTop: 4,
    paddingRight: 8,
    paddingBottom: 4
  }
}));

export default StyledTableCell;
