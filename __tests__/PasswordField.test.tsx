import { fireEvent, render } from '@testing-library/react'
import { PasswordField } from '../src/components/PasswordField/PasswordField'


it('sets the input label and the type password correctly', () => {
  const component       = (<PasswordField fieldId={'password'} labelTitle={'Password'} />);
  const { getByTestId } = render(component);
  const parentElement   = getByTestId('input-password');
  const labelElement    = parentElement.querySelector('label');
  const passwordElement = parentElement.querySelector('#password');
  expect(labelElement).toHaveTextContent('Password')
  expect(passwordElement).toHaveAttribute("type", "password")
});


it('toggles the password input-type and visibility-icon on icon/button click', () => {
  const component         = (<PasswordField fieldId={'password'} labelTitle={'Password'} />);
  const { getByTestId }   = render(component);
  const parentElement     = getByTestId('input-password');
  const passwordElement   = parentElement.querySelector('#password');

  const VisibilityIcon    = getByTestId('VisibilityIcon');
  expect(VisibilityIcon).toBeVisible();
  fireEvent.click(VisibilityIcon);
  expect(VisibilityIcon).not.toBeVisible();
  expect(passwordElement).toHaveAttribute("type", "text")

  const VisibilityOffIcon = getByTestId('VisibilityOffIcon');
  expect(VisibilityOffIcon).toBeVisible();
  fireEvent.click(VisibilityOffIcon);
  expect(VisibilityOffIcon).not.toBeVisible();
  expect(passwordElement).toHaveAttribute("type", "password")

});
