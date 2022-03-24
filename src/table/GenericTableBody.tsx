import { TableBody, TableRow, TableCell } from "@mui/material";


type GenericTableBodyProps = {
  rows : Record<string, any>[]; // TODO define proper props types
}

export const GenericTableBody = (props: GenericTableBodyProps) => {
  return (
    <TableBody>
      {/* if you don't need to support IE11, you can replace the `stableSort` call with:
      rows.slice().sort(getComparator(order, orderBy)) */}
      {props.rows.map((row, index) => {

        const tableCells: Record<string, any> = []; // TODO define proper props types

        Object.entries(row).forEach(
          ([key, value]) => {
            tableCells.push(<TableCell key={key} padding="normal">{value}</TableCell>)
          }
        );

        return (
          <TableRow
            hover
            tabIndex={-1}
            key={row.counter}
          >
            {tableCells}
          </TableRow>
        );
      })}
    </TableBody>
  )
}


export default GenericTableBody;