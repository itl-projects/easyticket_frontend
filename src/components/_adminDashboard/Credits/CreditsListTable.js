import * as React from 'react';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { visuallyHidden } from '@material-ui/utils';
import { LoadingButton } from '@material-ui/lab';
import Label from '../../Label';

function createData(name, calories, fat, carbs, protein, status) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    status
  };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3, 'pending'),
  createData('Donut', 452, 25.0, 51, 4.9, 'cancelled'),
  createData('Eclair', 262, 16.0, 24, 6.0, 'settle'),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 'settled'),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 'settle'),
  createData('Honeycomb', 408, 3.2, 87, 6.5, 'settle'),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 'settled'),
  createData('Jelly Bean', 375, 0.0, 94, 0.0, 'settle'),
  createData('KitKat', 518, 26.0, 65, 7.0, 'settled'),
  createData('Lollipop', 392, 0.2, 98, 0.0, 'settle'),
  createData('Marshmallow', 318, 0, 81, 2.0, 'cancelled'),
  createData('Nougat', 360, 19.0, 9, 37.0, 'settle'),
  createData('Oreo', 437, 18.0, 63, 4.0, 'pending')
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Sr No.'
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'Agent Ref'
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'Agency Name'
  },
  {
    id: 'carbs',
    numeric: true,
    disablePadding: false,
    label: 'Credit Ref'
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Request Date'
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Transfer Date'
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Amount'
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Remark'
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Status'
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', px: 4 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow hover tabIndex={-1} key={row.name}>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">{row.calories}</TableCell>
                    <TableCell align="center"> {row.name}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                    <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                    <TableCell align="center">{row.protein}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">
                      {row.status === 'pending' && (
                        <LoadingButton size="small" variant="contained" color="secondary">
                          Approve
                        </LoadingButton>
                      )}
                      {row.status === 'settle' && (
                        <LoadingButton size="small" variant="contained">
                          Settle
                        </LoadingButton>
                      )}
                      {row.status !== 'pending' && row.status !== 'settle' && (
                        <Label
                          variant="ghost"
                          color={(row.status === 'cancelled' && 'error') || 'success'}
                        >
                          {sentenceCase(row.status)}
                        </Label>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
