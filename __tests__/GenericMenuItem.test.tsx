import { Edit } from '@mui/icons-material';
import { render } from '@testing-library/react'
import { GenericMenuItem } from '../src/components/Generic/GenericMenuItem';


it('sets title and icon for a menu item correctly', () => {
  const component       = (<GenericMenuItem title={'Edit this item'} icon={<Edit />} redirectURL={'/clients/edit'} />);
  const { getByTestId } = render(component);
  const menuElement     = getByTestId('menu-item');
  const EditIconElement = getByTestId('EditIcon');

  expect(EditIconElement).toBeVisible();
  expect(menuElement).toBeVisible();
  expect(menuElement).toHaveTextContent('Edit this item');

});
