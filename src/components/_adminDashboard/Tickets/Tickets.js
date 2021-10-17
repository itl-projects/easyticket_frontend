import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Stack from '@material-ui/core/Stack';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-eva/trash-2-fill';
import editIcon from '@iconify/icons-eva/edit-2-fill';
import { ticketsAPI } from '../../../services/admin';
import {
  formatPrice,
  getAirlineNameById,
  getAirportNameById,
  getFormattedDate,
  getUserRoleName,
  successMessage,
  errorMessage
} from '../../../utils/helperFunctions';
import { useAdminContext } from '../../../context/AdminContext';
import { TableSkeleton } from '../../skeletons';
import DeleteAlertDialog from './DeleteAlertDialog';

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
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Action'
  }
];

function TicketListTableHead() {
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

TicketListTable.propTypes = {
  filters: PropTypes.object
};

export default function TicketListTable({ filters }) {
  const adminContext = useAdminContext();
  const { showTicketModal, toggleShowTicketModal } = adminContext;

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [tickets, setTickets] = React.useState([]);
  const [totalTickets, setTotalTickets] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [currentTicket, setCurrentTicket] = React.useState(null);

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
    const data = {
      page: page + 1,
      limit: rowsPerPage,
      ...filters
    };
    const res = await ticketsAPI.listTickets(data);
    setLoading(false);
    if (res && res.status === 201) {
      if (res.data && res.data.success) {
        setTickets(res.data.data);
        setTotalTickets(res.data.meta.totalItems);
      }
    }
  };

  React.useEffect(() => {
    if (!showTicketModal) getTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, showTicketModal, filters]);

  const onDeleteConfirm = async (status) => {
    if (currentTicket && status) {
      const id = currentTicket?.id;
      setCurrentTicket(null);
      setDeleting(true);
      const res = await ticketsAPI.removeTicket(id);
      setDeleting(false);
      if (res && res.data) {
        if (res.data.success) {
          getTickets();
          successMessage(res.data.message);
          return;
        }
        errorMessage('Sorry! Failed to delete ticket');
      }
    } else {
      setCurrentTicket(null);
    }
  };

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table size="small">
          <TicketListTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
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
                    <TableCell align="center" padding="none">
                      <Tooltip title="Edit">
                        <IconButton
                          color="info"
                          size="small"
                          onClick={(e) => toggleShowTicketModal(e, row)}
                        >
                          <Icon icon={editIcon} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setCurrentTicket(row)}
                        >
                          <Icon icon={deleteIcon} />
                        </IconButton>
                      </Tooltip>
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
        {!loading && tickets.length <= 0 && (
          <Typography sx={{ my: 3 }} textAlign="center" variant="h5">
            No tickets found !
          </Typography>
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
      <DeleteAlertDialog
        open={currentTicket !== null}
        onResponse={onDeleteConfirm}
        status={currentTicket?.isActive}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={deleting}
        onClick={() => setDeleting(false)}
      >
        <Stack
          alignItems="center"
          sx={{
            position: 'absolute',
            right: '40%',
            top: '60%'
          }}
        >
          <Typography mb={2}>Please Wait...</Typography>
          <CircularProgress color="inherit" />
        </Stack>
      </Backdrop>
    </Paper>
  );
}
