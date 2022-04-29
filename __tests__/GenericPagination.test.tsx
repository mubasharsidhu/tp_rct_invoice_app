import { render } from '@testing-library/react'
import { GenericPagination } from '../src/components/Generic/GenericPagination';
import { DEFAULT_ROWS_PER_PAGE } from '../src/config/config';


it('sets the pagination links correctly along with the selected page', () => {

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
  }

  const totalRecords      = 23;
  const currentPageNumber = 2;

  const component = (
    <GenericPagination
      totalRecords={totalRecords}
      currentPageNumber={currentPageNumber}
      handlePaginationChange={handlePaginationChange}
    />
  );

  const { getByTestId }    = render(component);
  const paginationElement  = getByTestId('pagination');

  const renderedLinks      = paginationElement.querySelectorAll('.MuiPaginationItem-page');
  const renderedLinksCount = renderedLinks.length;
  const expectedLinksCount = Math.ceil( totalRecords / DEFAULT_ROWS_PER_PAGE );
  expect(renderedLinksCount).toBe(expectedLinksCount);

  const currentLink = paginationElement.querySelectorAll(`.MuiPaginationItem-page`).item((currentPageNumber-1));
  expect(currentLink).toHaveClass('Mui-selected');

});

