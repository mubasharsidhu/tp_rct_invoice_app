import { Grid, Table, TableBody, TableCell, TableRow, Paper, Typography, TableHead, TableContainer } from "@mui/material"
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
  genericError?       : string
  currentInvoice?     : InvoiceDetailPropsModel | undefined
  currentInvoiceClient: ClientPropsModel | undefined,
  formatDate          : (date: Date) => string;
}

export const InvoiceDetail = (props: InvoiceDetailProps) => {

  return (
    <>
      {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

      <Grid>
        <Grid item xs={12}>
          <Paper sx={{ p:2 }} >
            <Grid>

              <Grid item
                xs={12} mb={3}
                container
                borderRadius={1}
                bgcolor={'primary.light'}
                color={'primary.contrastText'}
                sx={{ py:2 }}
                justifyContent="center"
              >
                <Typography component="h1" variant="h2">Invoice</Typography>
              </Grid>

              <Grid item container mb={3} spacing={2}>

                <Grid item xs={12} sm={6} md={4}>
                  <TableContainer>
                    <Table aria-label="Billed To" size="small">
                      <TableHead>
                        <TableRow><TableCell colSpan={2} align="center">Billed To</TableCell></TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell variant="head">Name:</TableCell><TableCell>{props.currentInvoiceClient?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Email:</TableCell><TableCell>{props.currentInvoiceClient?.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Company Name:</TableCell><TableCell>{props.currentInvoiceClient?.companyDetails.name}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Tax Number:</TableCell><TableCell>{props.currentInvoiceClient?.companyDetails.vatNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Reg Number:</TableCell><TableCell>{props.currentInvoiceClient?.companyDetails.regNumber}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Address:</TableCell><TableCell>{props.currentInvoiceClient?.companyDetails.address}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid
                  item xs={12} sm={6} md={4}
                  sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
                  >
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TableContainer>
                    <Table aria-label="Invoice Information" size="small">
                      <TableHead>
                          <TableRow><TableCell colSpan={2} align="center">Invoice Information</TableCell></TableRow>
                        </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell variant="head">Invoice Number:</TableCell><TableCell>{props.currentInvoice?.invoice_number}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Project Code:</TableCell><TableCell>{props.currentInvoice?.projectCode}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Invoice Date:</TableCell><TableCell>{props.currentInvoice?.date ? props.formatDate(props.currentInvoice.date) : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell variant="head">Due Date:</TableCell><TableCell>{props.currentInvoice?.dueDate ? props.formatDate(props.currentInvoice.dueDate) : ""}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

              </Grid>

              <Grid item key={"Invoice Items"} xs={12} mb={3}>
                <TableContainer>
                  <Table aria-label="Invoice Items" size="small">
                    <TableHead>
                      <TableRow><TableCell>Item</TableCell><TableCell align="right">Price</TableCell></TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        props.currentInvoice?.meta
                        ? props.currentInvoice?.meta.map((data, index)=>{
                          return (
                            <TableRow key={index} hover>
                              <TableCell sx={{textTransform:"capitalize"}}>{data.item}:</TableCell>
                              <TableCell align="right">$ {data.price}</TableCell>
                            </TableRow>
                          )
                        })
                        : null
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <Table
                  aria-label="Totals"
                  size="small"
                  sx={{mt:3, display: 'flex', flexDirection: 'row-reverse',}}>
                  <TableBody>
                    <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Sub Total:</TableCell><TableCell align="right">$ {props.currentInvoice?.value}</TableCell>
                    </TableRow>
                    <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Tax:</TableCell><TableCell align="right">$ {0}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Grand Total:</TableCell><TableCell align="right">$ {props.currentInvoice?.value}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>

          </Paper>

        </Grid>

      </Grid>
    </>
  )

}
