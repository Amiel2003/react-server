import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/material';
import './Table.css'
import { useMediaQuery } from '@mui/material';
import { formatDateToLetters } from '../../functions/FormatDate';

function createData(name, trackingID, date, branch) {
  return { name, trackingID, date, branch }
}

const makeStyle = (status) => {
  return {
    background: '#59bfff',
    color: 'white',
  }
}

export default function BasicTable({ user, sales, branch }) {
  const isScreenLarge = useMediaQuery('(min-width: 1650px)');
  const tableMinWidth = isScreenLarge ? 600 : 0;
  let reversedSales = [];

  switch (user.role) {
    case 'admin':
      reversedSales = [...sales].reverse();
      break;
    case 'supervisor':
      const branchID = branch._id
      const filteredSales = sales.filter(sale => sale.branch._id === branchID)
      reversedSales = [...filteredSales].reverse();
      break;
    case 'cashier':
      const branchIDCashier = branch._id
      const filteredSalesCashier = sales.filter(sale => sale.branch._id === branchIDCashier)
      reversedSales = [...filteredSalesCashier].reverse();
      break;
    default:
      break;
  }

  return (
    <div className="Table">
      <h3>Recent Sales</h3>
      <TableContainer component={Paper}
        style={{ boxShadow: '0px 13px 20px 0px #80808029' }}
      >
        <Table sx={{ minWidth: tableMinWidth }} aria-label="simple table" className='MUITable'>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Branch</TableCell>
              {/* <TableCell align="left"></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {reversedSales.slice(0, 5).map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.in_charge.first_name} {row.in_charge.last_name}
                </TableCell>
                <TableCell align="left">{formatDateToLetters(row.date_added)}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.branch.branch_name)}>{row.branch.branch_name}</span>
                </TableCell>
                {/* <TableCell align="left" className='Details'>Detail</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
