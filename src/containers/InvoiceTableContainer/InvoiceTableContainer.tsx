import { Paper, TableContainer, Table, Grid, Autocomplete, TextField} from "@mui/material"
import router from "next/router"
import { memo, SyntheticEvent, useEffect, useState } from "react"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"
import { InvoiceResponseModel, InvoiceJobs as InvoiceJobs } from "../../api/invoices"
import { InvoicePropsModel as InvoiceRowPropsModel, InvoicesTableBody } from "../../components/Invoices/InvoicesTableBody"
import { InvoicesTableHead } from "../../components/Invoices/InvoicesTableHead"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"
import { GenericPagination } from "../../components/Generic/GenericPagination"
import { useAuthContext } from "../../contexts/AuthContextProvider"
import { ClientJobs, ClientResponseModel } from "../../api/clients"


export type Order = 'asc' | 'desc';

export type InvoiceSortBy = 'clientName' | 'invoiceNumber' | 'dueDate' | 'value';

interface HeadCell {
  id         : string;
  label      : string;
  isSortable?: boolean
}

export const headCells: readonly HeadCell[] = [
  {
    id        : 'clientName',
    label     : 'Client Name',
    isSortable: true
  },
  {
    id   : 'companyName',
    label: 'Company Name',
  },
  {
    id        : 'invoiceNumber',
    label     : 'Number',
    isSortable: true
  },
  {
    id        : 'dueDate',
    label     : 'Due Date',
    isSortable: true
  },
  {
    id        : 'value',
    label     : 'Total',
    isSortable: true
  },
  {
    id   : 'manage',
    label: 'Manage',
  }
];


export type InvoiceTableContainerProps = {
  isMainPage?    : boolean,
  clientID?      : string
  initialPayload?: {
    invoices: InvoiceRowPropsModel[],
    total   : number,
  },
}


export const InvoiceTableContainer = memo<InvoiceTableContainerProps>( (props) => {

  const initialPayloadInvoices = props.initialPayload?.invoices ?? [];
  const totalInvoicesInitial   = props.initialPayload?.total ?? 0;
  const offset                 = ( parseInt(router.query?.page as string, 10 ) - 1 ?? 1 ) * DEFAULT_ROWS_PER_PAGE

  const authUserToken                       = useAuthContext().authUserToken;
  const [allClientsList, setAllClientsList] = useState<{ id: string, label: string }[] | undefined>(undefined);
  const [invoicesArray, setInvoicesArray]   = useState<InvoiceRowPropsModel[]>(initialPayloadInvoices);
  const [totalInvoices, setTotalInvoices]   = useState<number>(totalInvoicesInitial);
  const [errorMessage, setErrorMessage]     = useState<string | undefined>();

  const clientID          = router.query.clientID ? router.query.clientID as string : ( props.clientID ?? "" );
  const orderBy           = router.query.orderBy ? router.query.orderBy as InvoiceSortBy : 'clientName';
  const order             = router.query.order ? router.query.order as Order : 'asc';
  const currentPageNumber = router.query.page ? parseInt(router.query.page as string, 10) : 1

  const clientIDFilterHandler = (event: SyntheticEvent<Element, Event>, optionObject: { id: string, label: string } | string | null ): void => {
    const clientID = optionObject && typeof optionObject === 'object' ? optionObject.id : "";
    router.push(`/invoices?clientID=${clientID}&orderBy=${orderBy}&order=${order}`);
  }

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/invoices?clientID=${clientID}&orderBy=${orderBy}&order=${order}&page=${value}`)
  }

  const handleRequestSort = ( event: React.MouseEvent<unknown>, property?: InvoiceSortBy ) => {
    if (!property) {
      return;
    }
    const isAsc    = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    router.push(`/invoices?clientID=${clientID}&orderBy=${property}&order=${newOrder}`);
  };


  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    const invoicesHandlerResponse = InvoiceJobs.getInvoices({
      authUserToken: authUserToken,
      orderBy      : orderBy,
      order        : order,
      offset       : offset,
      clientID     : clientID
    });

    invoicesHandlerResponse.then((response) => {

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
        setInvoicesArray(response.invoices as InvoiceResponseModel[]);
        setTotalInvoices(response.total as number);
      }

    })

  }, [authUserToken, clientID, orderBy, order, offset]);


  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    // Get All Clients Starts here
    const clientsHandlerResponse = ClientJobs.getClients({
      authUserToken: authUserToken,
      orderBy      : "clientName",
      order        : "asc",
      limit        : -1
    });
    clientsHandlerResponse.then((response) => {
      if ( response.type === "error" ) {
        if ( typeof response.error === 'string' ) {
          setErrorMessage(response.error);
        }
        else {
          const errorObj = response.error as object;
          setErrorMessage( errorObj.toString() );
        }
      }
      else {
        const responseClients = response.clients as ClientResponseModel[];

        let clientsOptions: Array<{ id: string, label: string }> | undefined = [];
        if ( responseClients != null ) {
          responseClients.map((data: ClientResponseModel) => {
            clientsOptions ? clientsOptions.push({ id: data.id, label: (data.name + ' (' + data.email + ')') }) : [];
          });
        }
        setErrorMessage(""); // resetting the error message if it was there before
        setAllClientsList(clientsOptions as { id: string, label: string }[]);
      }
    });

    clientsHandlerResponse.catch((err: unknown)=>{
      setErrorMessage("An Unknown error occured"); // resetting the error message if it was there before
    });
    // Get All Clients Ends here

  }, [authUserToken]);

  return (
    <Grid >
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}

      {
        props.isMainPage
        ? <Grid item xs={12} >
            <Autocomplete
              sx={{maxWidth: "300px", mb:1}}
              size="small"
              freeSolo
              options={allClientsList ? allClientsList.map((option) => option) : []}
              value={clientID && allClientsList
                ? allClientsList.find((obj)=>{
                    return obj.id === clientID ? obj.id : ""
                  })
                : ""
              }
              onChange={clientIDFilterHandler}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    id={"clientID"}
                    name={"clientID"}
                    label={"Filter by Client"}
                    margin="dense"
                  />
                )
              }}
            />
          </Grid>
        : null
      }

      <Grid item>
        <Paper sx={{ mb: 2 }}>
          <TableContainer>
            <Table aria-labelledby="Invoices" >
              <InvoicesTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                pagination={props.isMainPage}
              />
              <InvoicesTableBody rows={invoicesArray}/>
            </Table>
          </TableContainer>
          {
            props.isMainPage && totalInvoices > DEFAULT_ROWS_PER_PAGE
            ? (<GenericPagination
                totalRecords={totalInvoices}
                currentPageNumber={currentPageNumber}
                handlePaginationChange={handlePaginationChange}
              />)
            : null
          }
        </Paper>
      </Grid>
    </Grid>
  )

})
