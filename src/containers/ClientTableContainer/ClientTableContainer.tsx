import router from "next/router"
import { memo, useState } from "react"
import GenericTable from "../../table/GenericTable"


export interface Data {
  counter    : number
  email      : string
  name       : string
  companyName: string
}

const createData = (
  counter    : number,
  email      : string,
  name       : string,
  companyName: string,
  ) : Data => {
  return {
    counter,
    email,
    name,
    companyName,
  };
}

export const rows = [
  createData(1, 'abc1@gmail.com', 'ABC-1', 'XYZ-1'),
  createData(2, 'abc2@gmail.com', 'ABC-2', 'XYZ-2'),
  createData(3, 'abc3@gmail.com', 'ABC-3', 'XYZ-3'),
  createData(4, 'abc4@gmail.com', 'ABC-4', 'XYZ-4'),
];


export type Order = 'asc' | 'desc';

export type ClientResponseModel = {
    id: string;
    email: string;
    name: string;
    totalBilled: number;
    invoicesCount: number;
    companyDetails: {
        name: string;
        address: string;
        vatNumber: string;
        regNumber: string;
    };
}

interface HeadCell {
  id        : keyof Data;
  label     : string;
  isSortable?: boolean
}

export const headCells: readonly HeadCell[] = [
  {
    id   : 'counter',
    label: 'Counter',
  },
  {
    id   : 'email',
    label: 'Email',
  },
  {
    id        : 'name',
    label     : 'Name',
    isSortable: true
  },
  {
    id   : 'companyName',
    label: 'Company Name',
  }
];


export type ClientTableProps = {
  initialPayload?: {
      clients: ClientResponseModel[],
      total: number
  }
}

export const ClientTable = memo<ClientTableProps>( (props) => {
  // TODO probaly a good place to typecheck
  const currentPageNumber = router.query.page
  ? parseInt(router.query.page as string, 10)
  : 1

  const clientsArray = props.initialPayload?.clients ?? [];
  const totalClients = props.initialPayload?.total ?? 0;

  const [limit, setLimit] = useState(2);
  const [order, setOrder] = useState<Order>('asc');
  //const [orderBy, setOrderBy] = useState<ClientSortBy>('email');

  return (
    <GenericTable />
  )

})