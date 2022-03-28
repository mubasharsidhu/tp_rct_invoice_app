import { TableBody, TableRow, TableCell } from "@mui/material";
import { ClientResponseModel } from "../../containers/ClientTableContainer/ClientTableContainer";


type ClientsTableBodyProps = {
  rows: ClientResponseModel[]
}

export const ClientsTableBody = (props: ClientsTableBodyProps) => {

  return (
    <>
      <TableBody>
        {props.rows.map((row, index) => {
          return (
            <TableRow
              hover
              tabIndex={-1}
              key={index}
            >
              <TableCell key={3} padding="normal">{row.name}</TableCell>
              <TableCell key={2} padding="normal">{row.email}</TableCell>
              <TableCell key={4} padding="normal">{row.companyDetails.name}</TableCell>
            </TableRow>
          );
        })}

      </TableBody>
    </>
  )

}
