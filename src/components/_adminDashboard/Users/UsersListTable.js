import * as React from 'react';
import { sentenceCase } from 'change-case';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Stack from '@material-ui/core/Stack';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Icon } from '@iconify/react';
import creditCardFill from '@iconify/icons-eva/credit-card-fill';
import eyeFill from '@iconify/icons-eva/eye-outline';
import personDeleteFill from '@iconify/icons-eva/person-delete-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import personTag24Regular from '@iconify-icons/fluent/person-tag-24-regular';
import Label from '../../Label';
import { usersAPI } from '../../../services/admin';
import {
  formatPrice,
  getUserRoleName,
  successMessage,
  errorMessage
} from '../../../utils/helperFunctions';
import { useAdminContext } from '../../../context/AdminContext';
import { TableSkeleton } from '../../skeletons';
import ActivateDeactivateAccountDialog from './ActivateDeactivateAccountDialog';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Sr No.'
  },
  {
    id: 'comapny',
    numeric: true,
    disablePadding: false,
    label: 'Agency Name'
  },
  {
    id: 'username',
    numeric: true,
    disablePadding: false,
    label: 'Ref ID'
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Type'
  },
  {
    id: 'city',
    numeric: true,
    disablePadding: false,
    label: 'City'
  },
  {
    id: 'state',
    numeric: true,
    disablePadding: false,
    label: 'State'
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status'
  },
  {
    id: 'commision',
    numeric: true,
    disablePadding: false,
    label: 'Avl. Balance'
  }
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left">
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align="center" padding="none">
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const adminContext = useAdminContext();
  const { showAgentModal } = adminContext;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [total, setTotalItems] = React.useState(0);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activateDeactivateStatus, setActivateDeactivateStatus] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getUsers = React.useCallback(async () => {
    setLoading(true);
    const res = await usersAPI.listUsers(page + 1, rowsPerPage);
    setLoading(false);
    if (res && res.status === 200) {
      setTotalItems(res.data.meta.totalItems);
      setData(res.data.items);
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (!showAgentModal) getUsers();
  }, [getUsers, showAgentModal]);

  const onActivateDeactivateResponse = async (res) => {
    setActivateDeactivateStatus(null);
    if (res) {
      setUpdating(true);
      const res = await usersAPI.changeUserActiveStatus(
        activateDeactivateStatus.id,
        !activateDeactivateStatus.isActive
      );
      setUpdating(false);
      if (res && res.status === 200) {
        if (res.data.success) {
          getUsers();
          successMessage(res.data.message);
        } else errorMessage(res.data.message);
      }
    }
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="small">
          <EnhancedTableHead />
          <TableBody>
            {!loading &&
              data.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                if (row.profile === null) return null;
                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell id={labelId} scope="row" align="left">
                      {page * 10 + index + 1}
                    </TableCell>
                    <TableCell align="left">{row.profile.company || 'Not Available'}</TableCell>
                    <TableCell align="left"> {row.username}</TableCell>
                    <TableCell align="left">{getUserRoleName(row.role)}</TableCell>
                    <TableCell align="left">{row.profile.city}</TableCell>
                    <TableCell align="left">{row.profile.state}</TableCell>
                    <TableCell align="left">
                      <Label color={row.isActive ? 'success' : 'error'}>
                        {sentenceCase(row.isActive ? 'Active' : 'In Active')}
                      </Label>
                    </TableCell>
                    <TableCell align="left">₹ {formatPrice(row.commision)}</TableCell>
                    <TableCell align="center" padding="none">
                      <IconButton size="small">
                        <Icon icon={eyeFill} />
                      </IconButton>
                      <IconButton color={!row.isActive ? 'error' : 'success'} size="small">
                        <Icon
                          icon={!row.isActive ? personDeleteFill : personAddFill}
                          onClick={() => setActivateDeactivateStatus(row)}
                        />
                      </IconButton>
                      <IconButton color="secondary" size="small">
                        <Icon icon={creditCardFill} />
                      </IconButton>
                      <IconButton color="warning" size="small">
                        <Icon icon={personTag24Regular} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && (
        <Stack px={2}>
          <TableSkeleton />
        </Stack>
      )}
      {!loading && data.length <= 0 && (
        <Typography sx={{ my: 3 }} textAlign="center" variant="h5">
          No Record found !
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
      <ActivateDeactivateAccountDialog
        open={activateDeactivateStatus !== null}
        onResponse={onActivateDeactivateResponse}
        status={activateDeactivateStatus?.isActive}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updating}
        onClick={() => setUpdating(false)}
      >
        <Stack alignItems="center">
          <Typography mb={2}>Please Wait...</Typography>
          <CircularProgress color="inherit" />
        </Stack>
      </Backdrop>
    </Paper>
  );
}
