import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Stack from '@material-ui/core/Stack';
import Button from '@material-ui/core/Button';
import { format } from 'date-fns';
import { useAdminContext } from '../../../context/AdminContext';
import { bookingsAPI } from '../../../services/admin';
import { TableSkeleton } from '../../skeletons';
import { formatPrice } from '../../../utils/helperFunctions';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'SI.No.'
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
    id: 'passengerCount',
    numeric: true,
    disablePadding: false,
    label: 'PAX'
  },
  {
    id: 'price',
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
    id: 'user.username',
    numeric: true,
    disablePadding: false,
    label: 'Agent ID'
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
        <TableCell align="center" padding="normal">
          PNR
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function PendingRequests() {
  const adminContext = useAdminContext();
  const { showUpdatePNRModal, toggleShowUpdatePNRModal } = adminContext;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [pendingRequests, setPendingRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [total, setTotalItems] = React.useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const getPendingBookingRequests = async () => {
    setLoading(true);
    const res = await bookingsAPI.listPendingBookings(page + 1, rowsPerPage);
    setLoading(false);

    if (res && res.status === 200) {
      if (res.data) {
        setPendingRequests(res.data.data.items);
        setTotalItems(res.data.data.meta.totalItems);
      }
    }
  };

  React.useEffect(() => {
    if (!showUpdatePNRModal) getPendingBookingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, showUpdatePNRModal, rowsPerPage]);

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="pendingTable" size="small">
          <EnhancedTableHead />
          <TableBody>
            {!loading &&
              pendingRequests.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" align="center">
                    {page * 10 + index + 1}
                  </TableCell>
                  <TableCell align="center">{row.bookingRef}</TableCell>
                  <TableCell align="center">
                    {format(
                      new Date(new Date(row.creationDate.replace(/(....Z)/, ''))),
                      'dd-MM-yyyy HH:mm:ss'
                    )}
                  </TableCell>
                  <TableCell align="center">{row.passengerCount}</TableCell>
                  <TableCell align="center">₹ {formatPrice(row.ticket?.price)}</TableCell>
                  <TableCell align="center">₹ {formatPrice(row.amount)}</TableCell>
                  <TableCell align="center">{row.user.username}</TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => toggleShowUpdatePNRModal(row)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {loading && (
          <Stack px={2}>
            <TableSkeleton />
          </Stack>
        )}
      </TableContainer>
      {!loading && pendingRequests.length <= 0 && (
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
