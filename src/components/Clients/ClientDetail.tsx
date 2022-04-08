import { Grid, Card, CardHeader, CardContent, Box, Typography, CardActions, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { ClientResponseModel } from "../../containers/ClientDetailContainer/ClientDetailContainer"
import { ErrorMessage } from "../ErrorMessage/ErrorMessage"

type ClientDetailProps = {
  genericError? : string
  currentClient?: ClientResponseModel | undefined
}


export const ClientDetail = (props: ClientDetailProps) => {
  return (
    <>
      {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

      <Grid container spacing={5}>

        <Grid item key={"Client Detail"} xs={12} sm={6} >
          <Card>
            <CardHeader
              title={"Client Detail"}
              titleTypographyProps={{ align: 'center' }}
              sx={{ backgroundColor: (theme) =>theme.palette.grey[200] }}
            />
            <CardContent>
            <Table aria-label="Company table" size="small">
              <TableBody>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Name:</TableCell><TableCell>{props.currentClient?.name}</TableCell>
                </TableRow>
                <TableRow  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Email:</TableCell><TableCell>{props.currentClient?.email}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Invoice Count:</TableCell><TableCell>{props.currentClient?.invoicesCount}</TableCell>
                </TableRow>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                  <TableCell variant="head">Total Billed:</TableCell><TableCell>{props.currentClient?.totalBilled}</TableCell>
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
                      <TableCell variant="head">Name:</TableCell><TableCell>{props.currentClient?.companyDetails.name}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Reg Number:</TableCell><TableCell>{props.currentClient?.companyDetails.regNumber}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Tax Number:</TableCell><TableCell>{props.currentClient?.companyDetails.vatNumber}</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                      <TableCell variant="head">Address:</TableCell><TableCell>{props.currentClient?.companyDetails.address}</TableCell>
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
