import { Box, Paper, TableContainer, Table} from "@mui/material"
import router from "next/router"
import { memo, useEffect, useState } from "react"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"
import { ClientAPI, InvalidUserTokenError } from "../../api/clients"
import { ClientsTableBody } from "../../components/ClientsTable/ClientsTableBody"
import { ClientsTableHead } from "../../components/ClientsTable/ClientsTableHead"
import { ErrorMessage } from "../../components/ErrorMessageComponent/ErrorMessage"
import { GenericPagination } from "../../components/GenericPagination/GenericPagination"
import { useAuthContext } from "../../contexts/AuthContextProvider"



export type Order = 'asc' | 'desc';

export type ClientSortBy = {
  clientName: string,
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
    id        : 'clientName',
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
  },
  {
    id   : 'totalBilled',
    label: 'Total Billed',
  }
];


export type ClientTableProps = {
  initialPayload?: {
    clients: ClientResponseModel[],
    total: number
  },
  pagination?: boolean
}


const getClientsHandler = async (
  authUserToken: string,
  orderBy      : keyof ClientSortBy,
  order        : Order,
  offset       : number
) => {

  try {
    const clientResponse = await ClientAPI.getClients(authUserToken, {
      order  : order,
      orderBy: orderBy,
      limit  : DEFAULT_ROWS_PER_PAGE,
      offset : offset
    });

    return {
      type: "success" as string,
      clients: clientResponse.clients as ClientResponseModel[]
    }

  } catch (err) {

    // TODO To be checked TNSB, maybe there is no return here
    return {
      type: "error" as string,
      error: err as unknown
    }

  }

}


export const ClientTable = memo<ClientTableProps>( (props) => {

  const handleRequestSort = ( event: React.MouseEvent<unknown>, property?: keyof ClientSortBy ) => {
    if (!property) {
      return;
    }
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const initialPayloadClients = props.initialPayload?.clients ?? [];
  const totalClients          = props.initialPayload?.total ?? 0;
  const offset                = ( parseInt(router.query?.page as string, 10 ) - 1 ?? 1) * DEFAULT_ROWS_PER_PAGE

  const [order, setOrder]               = useState<Order>('asc');
  const [orderBy, setOrderBy]           = useState<keyof ClientSortBy>('clientName');
  const [clientsArray, setClientsArray] = useState<ClientResponseModel[]>(initialPayloadClients);

  const authUserToken = useAuthContext().authUserToken;
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    const clientsHandlerResponse = getClientsHandler(authUserToken, orderBy, order, offset);

    clientsHandlerResponse.then((response) => {

      // TODO Type check for catch
      if ( response.type == "error" ) {
        if ( typeof response === 'string' ) {
          setErrorMessage(response.error);
        }
        else {
          setErrorMessage(response.error.toString());
        }
      }
      else {
        setErrorMessage(""); // reset error message if it was already there
        setClientsArray(response.clients);
      }

    })


  }, [order, orderBy, authUserToken, offset]);


  const currentPageNumber      = router.query.page ? parseInt(router.query.page as string, 10) : 1
  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/clients?page=${value}`)
  }

  return (
    <Box >
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
          >
            <ClientsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              pagination={props.pagination}
            />

            <ClientsTableBody rows={clientsArray}/>

          </Table>
        </TableContainer>

        {
          props.pagination
          ? (<GenericPagination
              totalRecords={totalClients}
              currentPageNumber={currentPageNumber}
              handlePaginationChange={handlePaginationChange}
            />)
          : null
        }

      </Paper>
    </Box>
  )

})
