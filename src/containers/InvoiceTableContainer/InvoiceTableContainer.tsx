import { Box, Paper, TableContainer, Table} from "@mui/material"
import router from "next/router"
import { memo, useEffect, useState } from "react"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"
import { InvoiceAPI } from "../../api/invoices"
import { InvoicesTableBody } from "../../components/Invoices/InvoicesTableBody"
import { InvoicesTableHead } from "../../components/Invoices/InvoicesTableHead"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"
import { GenericPagination } from "../../components/Generic/GenericPagination"
import { useAuthContext } from "../../contexts/AuthContextProvider"
import { InvoiceResponseModel } from "../InvoiceDetailContainer/InvoiceDetailContainer"


export type Order = 'asc' | 'desc';

export type InvoiceSortBy = 'clientName' | 'dueDate';

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


export type InvoiceTableContainerProps = {
  initialPayload?: {
    invoices: InvoiceResponseModel[],
    total  : number,
  },
  isDetailPage?: boolean,
}


export const getInvoicesHandler = async (params: {
  authUserToken: string,
  orderBy      : InvoiceSortBy,
  order        : Order,
  limit?       : number,
  offset?      : number
}) => {

  try {
    const invoiceResponse = await InvoiceAPI.getInvoices(params.authUserToken, {
      order  : params.order,
      orderBy: params.orderBy,
      limit  : params.limit ? params.limit : DEFAULT_ROWS_PER_PAGE,
      offset : params.offset
    });

    return {
      type   : "success" as string,
      invoices: invoiceResponse.invoices as InvoiceResponseModel[],
      total  : invoiceResponse.total as number
    }

  } catch (err) {

    return {
      type : "error" as string,
      error: err as any
    }

  }

}


export const InvoiceTableContainer = memo<InvoiceTableContainerProps>( (props) => {

  console.log('memo props: ', props);


  const initialPayloadInvoices = props.initialPayload?.invoices ?? [];
  const totalInvoices          = props.initialPayload?.total ?? 0;
  const offset                = ( parseInt(router.query?.page as string, 10 ) - 1 ?? 1 ) * DEFAULT_ROWS_PER_PAGE

  const authUserToken                   = useAuthContext().authUserToken;
  const [invoicesArray, setInvoicesArray] = useState<InvoiceResponseModel[]>(initialPayloadInvoices);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const orderBy                = router.query.orderBy ? router.query.orderBy as InvoiceSortBy : 'invoiceName';
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

    const invoicesHandlerResponse = getInvoicesHandler({
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
      {/* {errorMessage ? <ErrorMessage message={errorMessage} /> : null}
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
      </Paper> */}
    </Box>
  )

})
