import { Box, Paper, TableContainer, Table} from "@mui/material"
import router from "next/router"
import { memo, useEffect, useState } from "react"
import { DEFAULT_ROWS_PER_PAGE } from "../../config/config"
import { ClientJobs } from "../../api/clients"
import { ClientPropsModel } from "../../components/Clients/ClientDetail"
import { ClientsTableBody } from "../../components/Clients/ClientsTableBody"
import { ClientsTableHead } from "../../components/Clients/ClientsTableHead"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"
import { GenericPagination } from "../../components/Generic/GenericPagination"
import { useAuthContext } from "../../contexts/AuthContextProvider"


export type Order = 'asc' | 'desc';

export type ClientSortBy = 'clientName' | 'invoicesCount';

export interface HeadCell {
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
    id        : 'invoicesCount',
    label     : 'Invoices Count',
    isSortable: true
  },
  {
    id   : 'manage',
    label: 'Manage',
  }
];


export type ClientTableContainerProps = {
  initialPayload?: {
    clients: ClientPropsModel[],
    total  : number,
  },
  isMainPage?: boolean,
}


export const ClientTableContainer = memo<ClientTableContainerProps>( (props) => {

  const initialPayloadClients = props.initialPayload?.clients ?? [];
  const totalClients          = props.initialPayload?.total ?? 0;
  const offset                = ( parseInt(router.query?.page as string, 10 ) - 1 ?? 1 ) * DEFAULT_ROWS_PER_PAGE

  const authUserToken                   = useAuthContext().authUserToken;
  const [clientsArray, setClientsArray] = useState<ClientPropsModel[]>(initialPayloadClients);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const orderBy                = router.query.orderBy ? router.query.orderBy as ClientSortBy : 'clientName';
  const order                  = router.query.order ? router.query.order as Order : 'asc';
  const currentPageNumber      = router.query.page ? parseInt(router.query.page as string, 10) : 1

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/clients?orderBy=${orderBy}&order=${order}&page=${value}`)
  }

  const handleRequestSort = ( event: React.MouseEvent<unknown>, property?: ClientSortBy ) => {
    if (!property) {
      return;
    }
    const isAsc    = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    router.push(`/clients?orderBy=${property}&order=${newOrder}`);
  };


  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    let isEffectActive = true;

    const clientsHandlerResponse = ClientJobs.getClients({
      authUserToken: authUserToken,
      orderBy      : orderBy,
      order        : order,
      offset       : offset
    });

    clientsHandlerResponse.then((response) => {

      if ( isEffectActive ) {
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
          setClientsArray(response.clients as ClientPropsModel[]);
        }
      }

    });

    clientsHandlerResponse.catch((err: unknown)=>{
      setErrorMessage("An Unknown error occured");
    });

    return () => { isEffectActive = false }

  }, [authUserToken, orderBy, order, offset]);

  return (
    <Box >
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table id="clientsTableData" aria-labelledby="Clients" >
            <ClientsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              pagination={props.isMainPage}
            />
            <ClientsTableBody rows={clientsArray}/>
          </Table>
        </TableContainer>
        {
          props.isMainPage && totalClients > DEFAULT_ROWS_PER_PAGE
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
