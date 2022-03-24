
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


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


interface HeadCell {
  id            : keyof Data;
  label         : string;
}

export const headCells: readonly HeadCell[] = [
  {
    id            : 'counter',
    label         : 'Counter',
  },
  {
    id            : 'email',
    label         : 'Email',
  },
  {
    id            : 'name',
    label         : 'Name',
  },
  {
    id            : 'companyName',
    label         : 'Company Name',
  }
];
