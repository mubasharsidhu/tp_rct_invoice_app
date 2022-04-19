import { Grid, Card, CardHeader, CardContent, Table, TableBody, TableCell, TableRow } from "@mui/material"
import { ClientPropsModel } from "../Clients/ClientDetail"
import { ErrorMessage } from "../ErrorMessage/ErrorMessage"


export type InvoiceDetailPropsModel = {
  id            : string,
  user_id       : string,
  client_id     : string,
  date          : Date,
  dueDate       : Date,
  invoice_number: string,
  value         : number,
  projectCode?  : string,
  meta          : Array<{item: string, price: number}>
}


type InvoiceDetailProps = {
  genericError?  : string
  currentInvoice?: InvoiceDetailPropsModel | undefined
  clientName?    : string,
  formatDate: (date: Date) => string;
}


export const InvoiceDetail = (props: InvoiceDetailProps) => {
  console.log(props.currentInvoice)
  const aa = props.currentInvoice?.date ? props.formatDate(props.currentInvoice.date) : "";
  console.log(aa)
  return (
    <>
      {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

      <Grid container spacing={5} sx={{mb:5}}>

        <Grid item key={"Invoice Detail"} sm={12} md={6} >
          <Card>
            <CardHeader
              title={"Invoice Detail"}
              titleTypographyProps={{ align: 'center' }}
              sx={{ backgroundColor: (theme) =>theme.palette.grey[200] }}
            />
            <CardContent>
            <Table aria-label="Invoice table" size="small">
              <TableBody>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Client Name:</TableCell><TableCell>{props.clientName}</TableCell>
                </TableRow>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Invoice Number:</TableCell><TableCell>{props.currentInvoice?.invoice_number}</TableCell>
                </TableRow>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Date:</TableCell><TableCell>{props.currentInvoice?.date ? props.formatDate(props.currentInvoice.date) : ""}</TableCell>
                </TableRow>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Due Date:</TableCell><TableCell>{props.currentInvoice?.dueDate ? props.formatDate(props.currentInvoice.dueDate) : ""}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Project Code:</TableCell><TableCell>{props.currentInvoice?.projectCode}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Total Value:</TableCell><TableCell>$ {props.currentInvoice?.value}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item key={"Invoice Meta"} sm={12} md={6} >
          <Card>
            <CardHeader
              title={"Invoice Meta"}
              titleTypographyProps={{ align: 'center' }}
              sx={{ backgroundColor: (theme) =>theme.palette.grey[200] }}
            />
            <CardContent>
              <Table aria-label="Company table" size="small">
                <TableBody>

                  {
                    props.currentInvoice?.meta
                    ? props.currentInvoice?.meta.map((data, index)=>{
                      return (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                          <TableCell variant="head" sx={{textTransform:"capitalize"}}>{data.item}:</TableCell><TableCell>$ {data.price}</TableCell>
                        </TableRow>
                      )
                    })
                    : null
                  }

                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </>
  )
}
