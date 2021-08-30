import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import Stack from '@material-ui/core/Stack';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import Label from '../../Label';
import { bookingsAPI } from '../../../services/admin';
import { TableSkeleton } from '../../skeletons';
import {
  formatPrice,
  getAirlineNameById,
  getAirportNameById
} from '../../../utils/helperFunctions';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'SI. No.'
  },
  {
    id: 'bookingRef',
    numeric: true,
    disablePadding: false,
    label: 'Booking Ref'
  },
  {
    id: 'creationDate',
    numeric: true,
    disablePadding: false,
    label: 'Booking Date'
  },
  {
    id: 'ticket.airline',
    numeric: true,
    disablePadding: false,
    label: 'Airline'
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'From - To'
  },
  {
    id: 'travelDate',
    numeric: true,
    disablePadding: false,
    label: 'Travel Date'
  },
  {
    id: 'pax',
    numeric: true,
    disablePadding: false,
    label: 'PAX'
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Base Amount'
  },
  {
    id: 'amount',
    numeric: true,
    disablePadding: false,
    label: 'Booking Amount'
  },
  {
    id: 'pnr',
    numeric: true,
    disablePadding: false,
    label: 'PNR'
  },
  {
    id: 'agentRef',
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
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const getBookings = async () => {
    setLoading(true);
    const res = await bookingsAPI.listBookings(page + 1, rowsPerPage);
    setLoading(false);
    if (res && res.status === 200) {
      if (res.data && res.data.data) {
        setRows(res.data.data.items);
        setTotal(res.data.data.meta.totalItems);
      }
    }
  };

  React.useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
          <EnhancedTableHead />
          <TableBody>
            {!loading &&
              rows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell component="th" id={labelId} scope="row" align="center">
                      {page * 10 + index + 1}
                    </TableCell>
                    <TableCell align="center">{row.bookingRef}</TableCell>
                    <TableCell align="center">
                      {format(
                        new Date(new Date(row.creationDate.replace(/(....Z)/, ''))),
                        'dd-MM-yyyy HH:mm:ss'
                      )}
                    </TableCell>
                    <TableCell align="center">{getAirlineNameById(row.ticket.airline)}</TableCell>
                    <TableCell align="center" width={100}>
                      {getAirportNameById(row.ticket.source)} -
                      {getAirportNameById(row.ticket.destination)}
                    </TableCell>
                    <TableCell align="center">
                      {format(new Date(row.ticket.departureDateTime), 'dd-MM-yyyy HH:mm')}
                    </TableCell>
                    <TableCell align="center">{row.passengers.length}</TableCell>
                    <TableCell align="center">₹ {formatPrice(row.ticket.price)}</TableCell>
                    <TableCell align="center">₹ {formatPrice(row.amount)}</TableCell>
                    <TableCell align="center">
                      <Label
                        color={row.pnr ? 'success' : 'error'}
                        sx={{ textTransform: 'uppercase' }}
                      >
                        {row.pnr ? row.pnr : 'Pending'}
                      </Label>
                    </TableCell>

                    <TableCell align="center">{row.user.username}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {loading && (
          <Stack px={2}>
            <TableSkeleton />
          </Stack>
        )}
      </TableContainer>

      {!loading && rows.length <= 0 && (
        <Typography sx={{ my: 3 }} textAlign="center" variant="h5">
          No Pending Bookings found !
        </Typography>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
