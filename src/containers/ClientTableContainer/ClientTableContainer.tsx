import { Box, Paper, TableContainer, Table, TablePagination, Pagination, PaginationItem } from "@mui/material"
import router from "next/router"
import { memo, useState } from "react"
import { ClientsTableBody } from "../../components/ClientsTable/ClientsTableBody"
import { ClientsTableHead } from "../../components/ClientsTable/ClientsTableHead"
import { GenericPagination } from "../../components/GenericPagination/GenericPagination"



export type Order = 'asc' | 'desc';

export type ClientSortBy = {
  name: string,
  email: string
}

export type ClientResponseModel = {
  id: string;
  email: string;
  name: string;
  totalBilled: number;
  invoicesCount: number;
  companyDetails: {
    name: string;
    address: string;
    vatNumber: string;
    regNumber: string;
  };
}

interface HeadCell {
  id         : string;
  label      : string;
  isSortable?: boolean
}

export const headCells: readonly HeadCell[] = [
  {
    id        : 'name',
    label     : 'Name',
    isSortable: true
  },
  {
    id   : 'email',
    label: 'Email',
  },
  {
    id   : 'companyName',
    label: 'Company Name',
  }
];


export type ClientTableProps = {
  initialPayload?: {
    clients: ClientResponseModel[],
    total: number
  },
  pagination?: boolean
}

export const ClientTable = memo<ClientTableProps>( (props) => {

  const [order, setOrder]     = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ClientSortBy>('name');

  const handleRequestSort = ( event: React.MouseEvent<unknown>, property?: keyof ClientSortBy ) => {
    if (!property) {
      return;
    }
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const clientsArray           = props.initialPayload?.clients ?? [];
  const totalClients           = props.initialPayload?.total ?? 0;
  const currentPageNumber      = router.query.page ? parseInt(router.query.page as string, 10) : 1

  const EnvRowsPerPage         = process.env.NEXT_PUBLIC_ROWS_PER_PAGE ? parseInt(process.env.NEXT_PUBLIC_ROWS_PER_PAGE) : 10;
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/clients?page=${value}`)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
          >
            <ClientsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={4}
              pagination={props.pagination}
            />

            <ClientsTableBody rows={clientsArray}/>

          </Table>
        </TableContainer>

        {
          props.pagination
          ? (<GenericPagination
              totalRecords={totalClients}
              limit={EnvRowsPerPage}
              currentPageNumber={currentPageNumber}
              handlePaginationChange={handlePaginationChange}
            />)
          : null
        }

      </Paper>
    </Box>
  )

})
