import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import React, { MouseEvent } from 'react';
import { visuallyHidden } from '@mui/utils';
import { InvoiceSortBy, headCells, Order } from "../../containers/InvoiceTableContainer/InvoiceTableContainer";

interface InvoicesTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property?: InvoiceSortBy) => void;
  order        : Order;
  orderBy      : string;
  pagination?  : boolean
}

export const InvoicesTableHead = (props: InvoicesTableHeadProps) => {

  const { order, orderBy, onRequestSort } = props;
  const createSortHandler                 = (property: InvoiceSortBy) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {
              (headCell.isSortable && props.pagination)
                ?
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id as InvoiceSortBy)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                :
                (<span>{headCell.label}</span>)
            }

          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

}
