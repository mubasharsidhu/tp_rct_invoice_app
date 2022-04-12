import { Grid, Card, CardHeader, CardContent, Box, Typography, CardActions, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { InvoiceResponseModel } from "../../containers/InvoiceDetailContainer/InvoiceDetailContainer"
import { ErrorMessage } from "../ErrorMessage/ErrorMessage"

type InvoiceDetailProps = {
  genericError? : string
  currentInvoice?: InvoiceResponseModel | undefined
}


export const InvoiceDetail = (props: InvoiceDetailProps) => {
  return (
    <>
      {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

      <Grid container spacing={5}>

        <Grid item key={"Invoice Detail"} xs={12} sm={6} >
          <Card>
            <CardHeader
              title={"Invoice Detail"}
              titleTypographyProps={{ align: 'center' }}
              sx={{ backgroundColor: (theme) =>theme.palette.grey[200] }}
            />
            <CardContent>
            <Table aria-label="Company table" size="small">
              <TableBody>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Name:</TableCell><TableCell>{props.currentInvoice?.name}</TableCell>
                </TableRow>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Email:</TableCell><TableCell>{props.currentInvoice?.email}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Invoice Count:</TableCell><TableCell>{props.currentInvoice?.invoicesCount}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Total Billed:</TableCell><TableCell>{props.currentInvoice?.totalBilled}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid item key={"Company Detail"} xs={12} sm={6} >
          <Card>
            <CardHeader
              title={"Company Detail"}
              titleTypographyProps={{ align: 'center' }}
              sx={{ backgroundColor: (theme) =>theme.palette.grey[200] }}
            />
            <CardContent>
              <Table aria-label="Company table" size="small">
                <TableBody>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Name:</TableCell><TableCell>{props.currentInvoice?.companyDetails.name}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Reg Number:</TableCell><TableCell>{props.currentInvoice?.companyDetails.regNumber}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Tax Number:</TableCell><TableCell>{props.currentInvoice?.companyDetails.vatNumber}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Address:</TableCell><TableCell>{props.currentInvoice?.companyDetails.address}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </>
  )
}
