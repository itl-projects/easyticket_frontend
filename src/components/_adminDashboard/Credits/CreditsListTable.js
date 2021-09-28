import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { format } from 'date-fns';
import Label from '../../Label';
import { TableSkeleton } from '../../skeletons';
import StyledTableCell from '../../core/StyledTableCell';
import { creditRequestAPI } from '../../../services/admin';
import { formatPrice, successMessage, errorMessage } from '../../../utils/helperFunctions';
import { useAdminContext } from '../../../context/AdminContext';
import SettleCreditRequestDialog from './SettleCreditRequestDialog';

export default function EnhancedTable() {
  const adminContext = useAdminContext();
  const { showCreditApproveModal, showFundTransferModal, toggleShowCreditApproveModal } =
    adminContext;

  const [page, setPage] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentSettleRequest, setCurrentSettleRequest] = useState(null);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getMyCreditRequests = async () => {
    setLoading(true);
    const data = {
      page: page + 1,
      limit: rowsPerPage
    };
    const res = await creditRequestAPI.getCreditRequests(data);
    setLoading(false);
    if (res && res.status === 201) {
      setTotalBookings(res.data.meta.totalItems);
      setBookings(res.data.data);
    }
  };

  useEffect(() => {
    if (showCreditApproveModal === null && showCreditApproveModal === null) getMyCreditRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, showCreditApproveModal, showFundTransferModal]);

  const getStatusColor = (status) => {
    if (status === 'cancelled') return 'error';
    if (status === 'pending') return 'warning';
    if (status === 'approved') return 'success';
    return 'info';
  };

  const sendSettleRequest = async (res) => {
    const id = currentSettleRequest;
    setCurrentSettleRequest(null);
    if (res) {
      setLoading(true);
      const res = await creditRequestAPI.settleCreditRequest(id);
      setLoading(false);
      if (res && res.data) {
        if (res.data.success) {
          getMyCreditRequests();
          successMessage(res.data.message);
        } else {
          errorMessage(res.data.message);
        }
      } else {
        errorMessage('Sorry! something went wrong');
      }
    }
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" width="50">
                SI.No.
              </StyledTableCell>
              <StyledTableCell align="center">Agent Ref</StyledTableCell>
              <StyledTableCell align="center">Agency Name</StyledTableCell>
              <StyledTableCell align="center">Ref. No.</StyledTableCell>
              <StyledTableCell align="center">Request Date</StyledTableCell>
              <StyledTableCell align="center">Transfer Date</StyledTableCell>
              <StyledTableCell align="left" width="100">
                Amount
              </StyledTableCell>
              <StyledTableCell align="left" width="180">
                Remark
              </StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings &&
              !loading &&
              bookings.map((item, index) => (
                <TableRow key={`credit-request-item-${index}`}>
                  <StyledTableCell align="center">{page * 10 + index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{item.agent.username}</StyledTableCell>
                  <StyledTableCell align="center">{item.agent.profile.company}</StyledTableCell>
                  <StyledTableCell align="center">{item.creditRef}</StyledTableCell>
                  <StyledTableCell align="center">
                    {format(new Date(item.requestDate), 'dd-MM-yyyy hh:mm a')}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.transferDate
                      ? format(new Date(item.transferDate), 'dd-MM-yyyy hh:mm a')
                      : '-'}
                  </StyledTableCell>
                  <StyledTableCell align="left">₹{formatPrice(item.amount)}</StyledTableCell>
                  <StyledTableCell align="left" width="120">
                    {item.remark}
                  </StyledTableCell>

                  <StyledTableCell align="center" width="100">
                    <Label color={getStatusColor(item.status)} sx={{ textTransform: 'uppercase' }}>
                      {item.status}
                    </Label>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {item.status === 'pending' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => toggleShowCreditApproveModal(item)}
                      >
                        Approve
                      </Button>
                    )}
                    {item.status === 'approved' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setCurrentSettleRequest(item.id)}
                      >
                        Settle
                      </Button>
                    )}
                    {item.status === 'cancelled' && item.status === 'settled' && (
                      <Label
                        variant="ghost"
                        color={(item.status === 'cancelled' && 'error') || 'success'}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {item.status}
                      </Label>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack sx={{ p: 2 }} dir="column">
        {loading && <TableSkeleton />}
      </Stack>
      {!loading && bookings.length <= 0 && (
        <Typography sx={{ my: 3 }} textAlign="center" variant="h5">
          No credit requests found !
        </Typography>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalBookings}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <SettleCreditRequestDialog
        open={currentSettleRequest !== null}
        onResponse={sendSettleRequest}
      />
    </Paper>
  );
}
