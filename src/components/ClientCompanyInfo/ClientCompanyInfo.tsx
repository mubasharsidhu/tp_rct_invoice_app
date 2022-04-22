import { Grid, Table, TableBody, TableRow, TableCell } from "@mui/material"
import { ClientPropsModel } from "../Clients/ClientDetail"


type ClientCompanyInfoProps = {
  selectedClientInfo: ClientPropsModel | null
}

export const ClientCompanyInfo = (props: ClientCompanyInfoProps) => {

  return (
    <Grid container justifyContent="center" >
      <Grid item sm={12} md={8}>
        <Table
          aria-label="Company table" size="small"
          sx={{ mb:3, borderRadius: 1, backgroundColor: (theme) =>theme.palette.grey[200] }}
        >
          <TableBody>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
              <TableCell variant="head">Company Name:</TableCell><TableCell>{props.selectedClientInfo?.companyDetails.name}</TableCell>
              <TableCell variant="head">Reg Number:</TableCell><TableCell>{props.selectedClientInfo?.companyDetails.regNumber}</TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
              <TableCell variant="head">Tax Number:</TableCell><TableCell>{props.selectedClientInfo?.companyDetails.vatNumber}</TableCell>
              <TableCell variant="head">Address:</TableCell><TableCell>{props.selectedClientInfo?.companyDetails.address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  )

}