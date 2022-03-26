import { Box, Paper, TableContainer, Table, TablePagination } from "@mui/material";
import { useState, ChangeEvent, MouseEvent } from "react";
import { Order, Data, rows } from "../containers/ClientTableContainer/ClientTableContainer";
import GenericTableBody from "./GenericTableBody";
import { GenericTableHead } from "./GenericTableHead";

const GenericTable = () => {
  const EnvRowsPerPage = process.env.NEXT_PUBLIC_ROWS_PER_PAGE ? parseInt(process.env.NEXT_PUBLIC_ROWS_PER_PAGE) : 10;

  const [order, setOrder]             = useState<Order>('asc');
  const [orderBy, setOrderBy]         = useState<keyof Data>('counter');
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(EnvRowsPerPage);

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size='medium'
          >
            <GenericTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <GenericTableBody rows={rows}/>

          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default GenericTable;