import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Card from '@material-ui/core/Card';

const headCells = [
  {
    id: 'name',
    numeric: true,
    disablePadding: true,
    label: 'PAX No.'
  },
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title'
  },
  {
    id: 'firstName',
    numeric: false,
    disablePadding: true,
    label: 'First Name'
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: true,
    label: 'Last Name'
  },
  {
    id: 'mobile',
    numeric: false,
    disablePadding: true,
    label: 'Mobile Number'
  },
  {
    id: 'email',
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

SingleBookingDetailTable.propTypes = {
  passengers: PropTypes.array
};

export default function SingleBookingDetailTable({ passengers }) {
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <Card sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBody>
            {passengers &&
              passengers.map((row, index) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left"> {row.firstName}</TableCell>
                  <TableCell align="left">{row.lastName}</TableCell>
                  <TableCell align="left">{row.mobile}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Card>
  );
}
