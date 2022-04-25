import { render } from '@testing-library/react'
import Home from '../pages/index'

it('renders homepage unchanged', () => {
  const { container } = render(<Home clients={[]} total={0} />)
  expect(container).toMatchSnapshot()
})