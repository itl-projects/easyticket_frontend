import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0)
];

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'SI. No.'
  },
  {
    id: 'calories',
    numeric: true,
    disablePadding: false,
    label: 'Booking Ref'
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'Booking Date'
  },
  {
    id: 'carbs',
    numeric: true,
    disablePadding: false,
    label: 'Airline'
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'From - To'
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'Travel Date'
  },
  {
    id: 'protein',
    numeric: true,
    disablePadding: false,
    label: 'PAX'
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Booking Amount'
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'PNR'
  },
  {
    id: 'name',
    numeric: true,
    disablePadding: false,
    label: 'Agent Ref'
  }
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="center">
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
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
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow hover tabIndex={-1} key={row.name}>
                  <TableCell component="th" id={labelId} scope="row" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">{row.calories}</TableCell>
                  <TableCell align="center"> {new Date().toLocaleDateString()}</TableCell>
                  <TableCell align="center">{row.protein}</TableCell>
                  <TableCell align="center">
                    {new Date().toLocaleDateString()} - {new Date().toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{new Date().toLocaleDateString()}</TableCell>
                  <TableCell align="center">{row.protein}</TableCell>
                  <TableCell align="center">{row.protein}</TableCell>
                  <TableCell align="center">{row.protein}</TableCell>
                  <TableCell align="center">{row.protein}</TableCell>
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
