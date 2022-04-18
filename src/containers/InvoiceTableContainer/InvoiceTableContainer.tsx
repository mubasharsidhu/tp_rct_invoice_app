import { Box, Paper, TableContainer, Table} from "@mui/material"
import router from "next/router"
import { memo, useEffect, useState } from "react"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"
import { InvoiceResponseModel, InvoiceJobs as InvoiceJobs } from "../../api/invoices"
import { InvoicePropsModel as InvoiceRowPropsModel, InvoicesTableBody } from "../../components/Invoices/InvoicesTableBody"
import { InvoicesTableHead } from "../../components/Invoices/InvoicesTableHead"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"
import { GenericPagination } from "../../components/Generic/GenericPagination"
import { useAuthContext } from "../../contexts/AuthContextProvider"


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
  initialPayload?: {
    invoices: InvoiceRowPropsModel[],
    total  : number,
  },
  isDetailPage?: boolean,
}


export const InvoiceTableContainer = memo<InvoiceTableContainerProps>( (props) => {

  const initialPayloadInvoices = props.initialPayload?.invoices ?? [];
  const totalInvoices          = props.initialPayload?.total ?? 0;
  const offset                 = ( parseInt(router.query?.page as string, 10 ) - 1 ?? 1 ) * DEFAULT_ROWS_PER_PAGE

  const authUserToken                     = useAuthContext().authUserToken;
  const [invoicesArray, setInvoicesArray] = useState<InvoiceRowPropsModel[]>(initialPayloadInvoices);
  const [errorMessage, setErrorMessage]   = useState<string | undefined>();

  const orderBy                = router.query.orderBy ? router.query.orderBy as InvoiceSortBy : 'clientName';
  const order                  = router.query.order ? router.query.order as Order : 'asc';
  const currentPageNumber      = router.query.page ? parseInt(router.query.page as string, 10) : 1

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/invoices?orderBy=${orderBy}&order=${order}&page=${value}`)
  }

  const handleRequestSort = ( event: React.MouseEvent<unknown>, property?: InvoiceSortBy ) => {
    if (!property) {
      return;
    }
    const isAsc    = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    router.push(`/invoices?orderBy=${property}&order=${newOrder}`);
  };

  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    const invoicesHandlerResponse = InvoiceJobs.getInvoices({
      authUserToken: authUserToken,
      orderBy      : orderBy,
      order        : order,
      offset       : offset
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
      }

    })

  }, [authUserToken, orderBy, order, offset]);

  return (
    <Box >
      {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
      <Paper sx={{ mb: 2 }}>
        <TableContainer>
          <Table aria-labelledby="Invoices" >
            <InvoicesTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              pagination={props.isDetailPage}
            />
            <InvoicesTableBody rows={invoicesArray}/>
          </Table>
        </TableContainer>
        {
          props.isDetailPage && totalInvoices > DEFAULT_ROWS_PER_PAGE
          ? (<GenericPagination
              totalRecords={totalInvoices}
              currentPageNumber={currentPageNumber}
              handlePaginationChange={handlePaginationChange}
            />)
          : null
        }
      </Paper>
    </Box>
  )

})
