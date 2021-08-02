import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Card from '@material-ui/core/Card';

function createData(name, calories, fat, carbs, protein) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein
  };
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5)
];

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
    numeric: true,
    disablePadding: true,
    label: 'PAX No.'
  },
  {
    id: 'calories',
    numeric: false,
    disablePadding: true,
    label: 'Title'
  },
  {
    id: 'fat',
    numeric: false,
    disablePadding: true,
    label: 'First Name'
  },
  {
    id: 'carbs',
    numeric: false,
    disablePadding: true,
    label: 'Last Name'
  },
  {
    id: 'protein',
    numeric: false,
    disablePadding: true,
    label: 'Mobile Number'
  },
  {
    id: 'protein',
    numeric: false,
    disablePadding: true,
    label: 'Email Address'
  }
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding="normal">
            <TableSortLabel>{headCell.label}</TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function SingleBookingDetailTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card sx={{ width: '100%', px: 4 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow hover tabIndex={-1} key={row.name}>
                  <TableCell component="th" id={labelId} scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left"> {row.name}</TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">+91 987654678</TableCell>
                  <TableCell align="left">test@test.com</TableCell>
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
    </Card>
  );
}
