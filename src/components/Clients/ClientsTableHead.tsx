import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import React, { MouseEvent } from 'react';
import { visuallyHidden } from '@mui/utils';
import { ClientSortBy, headCells, Order } from "../../containers/ClientTableContainer/ClientTableContainer";

interface ClientsTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property?: ClientSortBy) => void;
  order        : Order;
  orderBy      : string;
  pagination?  : boolean
}

export const ClientsTableHead = (props: ClientsTableHeadProps) => {

  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: ClientSortBy) => (event: MouseEvent<unknown>) => {
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
                    onClick={createSortHandler(headCell.id as ClientSortBy)}
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