import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import React, { MouseEvent } from 'react';
import { visuallyHidden } from '@mui/utils';
import { Data, Order, headCells } from "../containers/ClientTableContainer/ClientTableContainer";

interface GenericTableHeadProps {
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export const GenericTableHead = (props: GenericTableHeadProps) => {
  const { order, orderBy, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: MouseEvent<unknown>) => {
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
              headCell.isSortable
                ?
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
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