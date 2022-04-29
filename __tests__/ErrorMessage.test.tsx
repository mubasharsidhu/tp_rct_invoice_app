import { render } from '@testing-library/react'
import { ErrorMessage } from '../src/components/ErrorMessage/ErrorMessage';


it('sets the error text correctly', () => {
  const component       = (<ErrorMessage message={'This is the sample error message text'} />);
  const { getByTestId } = render(component);
  const alertElement    = getByTestId('alert-error-message');
  expect(alertElement).toHaveTextContent('This is the sample error message text')
});