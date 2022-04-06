import { Pagination, PaginationItem, Box } from "@mui/material"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"

type GenericPaginationProps = {
  totalRecords          : number,
  currentPageNumber     : number,
  handlePaginationChange: (event: React.ChangeEvent<unknown>, value: number) => void,
}

export const GenericPagination= (props: GenericPaginationProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", py: 1  }}>
      <Pagination
        count={Math.ceil(props.totalRecords / DEFAULT_ROWS_PER_PAGE)}
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
