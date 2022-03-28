import { Pagination, PaginationItem, Box } from "@mui/material"

type GenericPaginationProps = {
  totalRecords          : number,
  limit                 : number,
  currentPageNumber     : number,
  handlePaginationChange: (event: React.ChangeEvent<unknown>, value: number) => void,
}

export const GenericPagination= (props: GenericPaginationProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", py: 1  }}>
      <Pagination
        count={Math.ceil(props.totalRecords / props.limit)}
        page={props.currentPageNumber}
        onChange={props.handlePaginationChange}
        renderItem={(item) => (
          <PaginationItem
            data-test={`page-${item.page}`}
            {...item}
          />
        )}
        shape="rounded"
        color="primary"
      />
    </Box>

  )
}