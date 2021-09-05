import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Stack, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { settingsAPI } from '../../../../services/admin';
import { formatPrice } from '../../../../utils/helperFunctions';
import { TableSkeleton } from '../../../skeletons';

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Sr No.'
  },
  {
    id: 'calories',
    numeric: false,
    disablePadding: false,
    label: 'Markup Name'
  },
  {
    id: 'fat',
    numeric: true,
    disablePadding: false,
    label: 'Price'
  },
  {
    id: 'carbs',
    numeric: true,
    disablePadding: false,
    label: 'Type'
  }
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding="normal"
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
MarkupDetailList.propTypes = {
  reloadData: PropTypes.number,
  reloadDone: PropTypes.func
};

export default function MarkupDetailList({ reloadData, reloadDone }) {
  const [page, setPage] = React.useState(0);
  const [total, setTotals] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [markups, setMarkups] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const listMarkups = async () => {
    setMarkups(null);
    setLoading(true);
    const res = await settingsAPI.getMarkups(page + 1, rowsPerPage);
    setLoading(false);
    if (res && res.status === 200) {
      if (res.data && res.data.success) {
        setMarkups(res.data.data.items);
        setTotals(res.data.data.meta.totalItems);
      }
    }
  };

  React.useEffect(() => {
    listMarkups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, reloadData]);

  React.useEffect(() => {
    if (reloadData) {
      listMarkups();
      reloadDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData]);

  return (
    <Card sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
          <EnhancedTableHead />
          <TableBody>
            {markups &&
              markups.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow hover tabIndex={-1} key={row.name}>
                    <TableCell component="th" id={labelId} scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="center">{formatPrice(row.price)}</TableCell>
                    <TableCell align="center">{row.type === 'pnr' ? 'PNR' : 'Per PAX'}</TableCell>
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
        {!loading && !markups && (
          <Typography sx={{ my: 3 }} textAlign="center" variant="h5">
            No Markup found !
          </Typography>
        )}
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
    </Card>
  );
}
