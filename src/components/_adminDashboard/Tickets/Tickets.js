import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Stack from '@material-ui/core/Stack';
import Paper from '@material-ui/core/Paper';
import { ticketsAPI } from '../../../services/admin';
import {
  formatPrice,
  getAirlineNameById,
  getAirportNameById,
  getFormattedDate,
  getUserRoleName
} from '../../../utils/helperFunctions';
import { useAdminContext } from '../../../context/AdminContext';
import { TableSkeleton } from '../../skeletons';

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Sr No.'
  },
  {
    id: 'departureDateTime',
    numeric: true,
    disablePadding: false,
    label: 'Departure Datetime'
  },
  {
    id: 'arrivalDateTime',
    numeric: true,
    disablePadding: false,
    label: 'Arrival Datetime'
  },
  {
    id: 'source',
    numeric: true,
    disablePadding: false,
    label: 'From - To'
  },
  {
    id: 'airline',
    numeric: true,
    disablePadding: false,
    label: 'Airline'
  },
  {
    id: 'flightNumber',
    numeric: true,
    disablePadding: false,
    label: 'Flight Number'
  },
  {
    id: 'quantity',
    numeric: true,
    disablePadding: false,
    label: 'Quantity'
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price'
  },
  {
    id: 'user.role',
    numeric: true,
    disablePadding: false,
    label: 'Uploaded By'
  }
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.numeric ? 'center' : 'left'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const adminContext = useAdminContext();
  const { showTicketModal } = adminContext;

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = React.useState([]);
  const [totalTickets, setTotalTickets] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

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
  };

  const getTickets = async () => {
    setLoading(true);
    const res = await ticketsAPI.listTickets(page + 1, rowsPerPage);
    setLoading(false);
    if (res && res.status === 200) {
      if (res.status) {
        setTickets(res.data.data);
        setTotalTickets(res.data.meta.totalItems);
      }
    }
  };

  React.useEffect(() => {
    getTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (!showTicketModal) getTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTicketModal]);

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {!loading &&
              tickets &&
              tickets.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell component="th" id={labelId} scope="row">
                      {page * 10 + index + 1}
                    </TableCell>
                    <TableCell align="center">{getFormattedDate(row.departureDateTime)}</TableCell>
                    <TableCell align="center">{getFormattedDate(row.arrivalDateTime)}</TableCell>
                    <TableCell align="center">
                      {getAirportNameById(row.source)} - {getAirportNameById(row.destination)}
                    </TableCell>
                    <TableCell align="center">{getAirlineNameById(row.airline)}</TableCell>
                    <TableCell align="center">{row.flightNumber}</TableCell>
                    <TableCell align="center">{row.quantity}</TableCell>
                    <TableCell align="center">₹ {formatPrice(row.price)}</TableCell>
                    <TableCell align="center">
                      {row.user ? getUserRoleName(row.user.role) : 'Unknown'}
                    </TableCell>
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalTickets}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
