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
import IconButton from '@material-ui/core/IconButton';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { visuallyHidden } from '@material-ui/utils';
import { Icon } from '@iconify/react';
import creditCardFill from '@iconify/icons-eva/credit-card-fill';
import eyeFill from '@iconify/icons-eva/eye-outline';
import personDeleteFill from '@iconify/icons-eva/person-delete-fill';
import personTag24Regular from '@iconify-icons/fluent/person-tag-24-regular';
import Label from '../../Label';
import { usersAPI } from '../../../services/admin';
import { USER_ROLES } from '../../../utils/constants';
import { useAdminContext } from '../../../context/AdminContext';

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
        <TableCell align="center" padding="none">
          Action
        </TableCell>
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
  const adminContext = useAdminContext();
  const { showAgentModal } = adminContext;

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [total, setTotalItems] = React.useState(0);
  const [data, setData] = React.useState([]);

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

  const getUsers = React.useCallback(async () => {
    const res = await usersAPI.listUsers(page + 1, rowsPerPage);
    if (res && res.status === 200) {
      setTotalItems(res.data.meta.totalItems);
      setData(res.data.items);
    }
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (!showAgentModal) getUsers();
  }, [getUsers, showAgentModal]);

  return (
    <Paper sx={{ width: '100%', px: 4 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {data.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              if (row.profile === null) return null;
              return (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell id={labelId} scope="row" padding="none">
                    {page * 10 + index + 1}
                  </TableCell>
                  <TableCell align="center">{row.profile.company || 'Not Available'}</TableCell>
                  <TableCell align="center"> {row.username}</TableCell>
                  {row.role === USER_ROLES.USER && <TableCell align="center">Agent</TableCell>}
                  {row.role === USER_ROLES.SUPPLIER && (
                    <TableCell align="center">Supplier</TableCell>
                  )}
                  {row.role === USER_ROLES.ADMIN && <TableCell align="center">Private</TableCell>}
                  <TableCell align="center">{row.profile.city}</TableCell>
                  <TableCell align="center">{row.profile.state}</TableCell>
                  <TableCell align="center">
                    <Label variant="ghost" color={(row.status !== 1 && 'error') || 'success'}>
                      {sentenceCase(row.status ? 'Active' : 'In Active')}
                    </Label>
                  </TableCell>
                  <TableCell align="center">₹ {row.commision}</TableCell>
                  <TableCell align="center" padding="none">
                    <IconButton size="small">
                      <Icon icon={eyeFill} />
                    </IconButton>
                    <IconButton color="error" size="small">
                      <Icon icon={personDeleteFill} />
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
