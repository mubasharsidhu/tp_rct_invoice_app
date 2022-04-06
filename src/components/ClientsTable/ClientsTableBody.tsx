import { Add, Edit } from "@mui/icons-material";
import { TableBody, TableRow, TableCell} from "@mui/material";
import { ClientResponseModel } from "../../containers/ClientTableContainer/ClientTableContainer";
import { GenericTableDropdown } from "../Generic/GenericDropdown";


type ClientsTableBodyProps = {
  rows: ClientResponseModel[]
}


export const ClientsTableBody = (props: ClientsTableBodyProps) => {

  return (
    <>
      <TableBody>
        {
          props.rows
          ?
          props.rows.map((row, index) => {

            const menuItems = [
              {
                title      : "Edit",
                icon       : <Edit fontSize="small" />,
                redirectURL: `/clients/${row.id}`
              },
              {
                title      : "Add a new invoice for the client",
                icon       : <Add fontSize="small" />,
                redirectURL: `/invoices/${row.id}`
              }
            ];

            return (
              <TableRow
                hover
                tabIndex={-1}
                key={index}
              >
                <TableCell key={1} padding="normal">{row.name}</TableCell>
                <TableCell key={2} padding="normal">{row.email}</TableCell>
                <TableCell key={3} padding="normal">{row.companyDetails.name}</TableCell>
                <TableCell key={4} padding="normal">{row.totalBilled}</TableCell>
                <TableCell key={5} padding="normal">
                  <GenericTableDropdown
                    index={index}
                    menuItems={menuItems}
                  />
                </TableCell>
              </TableRow>
            );
          })
          :
          <TableRow><TableCell colSpan={3}>No Record Found!</TableCell></TableRow>
        }

      </TableBody>
    </>
  )

}
