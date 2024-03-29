import { Edit, Print } from "@mui/icons-material";
import { TableBody, TableRow, TableCell} from "@mui/material";
import { useRouter } from "next/router";
import { CommonJobs } from "../../api/common";
import { GenericTableDropdown } from "../Generic/GenericDropdown";


export type InvoicePropsModel = {
  client: {
    id            : string;
    name          : string;
    user_id       : string;
    email         : string;
    companyDetails: {
      name     : string;
      address  : string;
      vatNumber: string;
      regNumber: string;
    };
  },
  invoice: {
    id            : string;
    userID        : string;
    client_id     : string;
    date          : Date;
    dueDate       : Date;
    invoice_number: string;
    value         : number;
  }
}


type InvoicesTableBodyProps = {
  rows: InvoicePropsModel[]
}

export const InvoicesTableBody = (props: InvoicesTableBodyProps) => {

  const router = useRouter();

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
                redirectURL: `/invoices/${row.invoice.id}`
              },
              {
                title      : "Print Invoice",
                icon       : <Print fontSize="small" />,
                redirectURL: `/invoices/view/${row.invoice.id}#print`
              }
            ];

            return (
              <TableRow
                hover
                tabIndex={-1}
                key={index}
                onClick={()=>{
                  router.push(`/invoices/view/${row.invoice.id}`);
                }}
                sx={{cursor:"pointer"}}
              >
                <TableCell key={1} padding="normal">{row.client.name}</TableCell>
                <TableCell key={2} padding="normal">{row.client.companyDetails.name}</TableCell>
                <TableCell key={3} padding="normal">{row.invoice.invoice_number}</TableCell>
                <TableCell key={4} padding="normal">{CommonJobs.formatDate(row.invoice.dueDate) }</TableCell>
                <TableCell key={5} padding="normal">{row.invoice.value}</TableCell>
                <TableCell key={6} padding="normal">
                  <GenericTableDropdown
                    index={index}
                    menuItems={menuItems}
                  />
                </TableCell>
              </TableRow>
            );
          })
          :
          <TableRow><TableCell colSpan={6}>No Record Found!</TableCell></TableRow>
        }

      </TableBody>
    </>
  )

}
