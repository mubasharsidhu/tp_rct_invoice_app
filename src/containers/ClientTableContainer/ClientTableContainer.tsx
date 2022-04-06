import { Box, Paper, TableContainer, Table} from "@mui/material"
import router from "next/router"
import { memo, SyntheticEvent, useCallback, useEffect, useState } from "react"
import type { searchOptionType } from "../../../pages/clients"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"
import { ClientAPI } from "../../api/clients"
import { ClientsTableBody } from "../../components/ClientsTable/ClientsTableBody"
import { ClientsTableHead } from "../../components/ClientsTable/ClientsTableHead"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"
import { GenericPagination } from "../../components/Generic/GenericPagination"
import { useAuthContext } from "../../contexts/AuthContextProvider"


export type Order = 'asc' | 'desc';

export type ClientSortBy = {
  clientName: string,
  email     : string
}

export type ClientResponseModel = {
  id            : string;
  email         : string;
  name          : string;
  totalBilled   : number;
  invoicesCount : number;
  companyDetails: {
    name     : string;
    address  : string;
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
  },
  {
    id   : 'manage',
    label: 'Manage',
  }
];


export type ClientTableProps = {
  initialPayload?: {
    clients       : ClientResponseModel[],
    total         : number,
    searchOptions?: searchOptionType
  },
  pagination?: boolean,
}


export const getClientsHandler = async (params: {
  authUserToken: string,
  orderBy      : keyof ClientSortBy,
  order        : Order,
  limit?       : number,
  offset?      : number
}) => {

  try {
    const clientResponse = await ClientAPI.getClients(params.authUserToken, {
      order  : params.order,
      orderBy: params.orderBy,
      limit  : params.limit ? params.limit : DEFAULT_ROWS_PER_PAGE,
      offset : params.offset
    });

    return {
      type   : "success" as string,
      clients: clientResponse.clients as ClientResponseModel[],
      total  : clientResponse.total as number
    }

  } catch (err) {

    return {
      type : "error" as string,
      error: err as any
    }

  }

}


export const searchOnChangeHandler = (event: SyntheticEvent<Element, Event>, inputValue?: string) => {
  console.log('iee: nputValue: ', inputValue)
  //setSearchKeyword(inputValue);

}


export const ClientTableContainer = memo<ClientTableProps>( (props) => {

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


  const [searchKeyword, setSeachKeyword] = useState<String>('');

  const [order, setOrder]                = useState<Order>('asc');
  const [orderBy, setOrderBy]            = useState<keyof ClientSortBy>('clientName');
  const [clientsArray, setClientsArray]  = useState<ClientResponseModel[]>(initialPayloadClients);
  const [errorMessage, setErrorMessage]  = useState<string | undefined>();

  const authUserToken = useAuthContext().authUserToken;

  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    const clientsHandlerResponse = getClientsHandler({
      authUserToken: authUserToken,
      orderBy      : orderBy,
      order        : order,
      offset       : offset
    });

    clientsHandlerResponse.then((response) => {

      if ( response.type === "error" ) {
        if ( typeof response.error === 'string' ) {
          setErrorMessage(response.error);
        }
        else {
          setErrorMessage(response.error.toString());
        }
      }
      else {
        setErrorMessage(""); // resetting the error message if it was there before
        setClientsArray(response.clients as ClientResponseModel[]);
      }

    })


  }, [order, orderBy, authUserToken, offset, searchKeyword]);


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
