import { render } from '@testing-library/react'
import { ClientDetail } from '../src/components/Clients/ClientDetail';


it('sets the client info correctly', () => {

  const clientInfo = {
    id            : '123rt456',
    email         : 'jest.tester.gmail.com',
    name          : 'Jest Tester',
    totalBilled   : 700,
    invoicesCount : 20,
    companyDetails: {
      name     : 'Jest Inc Private limited',
      address  : 'Boston',
      vatNumber: '45MRT-1232',
      regNumber: 'ABC-345'
    }
  }
  const component = (
    <ClientDetail
      genericError={'Here is the error'}
      currentClient={clientInfo}
      invoicesCount={20}
    />
  );

  const { getByTestId }     = render(component);

  const clientDetailElement = getByTestId('clientDetail');
  expect(clientDetailElement).toHaveTextContent('Client Detail');
  const clientDetailTable   = clientDetailElement.querySelectorAll('tr td:last-child');  // table values only (not headings)
  const toMatchClientInfo   = ['Jest Tester', 'jest.tester.gmail.com', 20];
  clientDetailTable.forEach((data, i)=>{
    expect(data).toHaveTextContent(`${toMatchClientInfo[i]}`);
  });

  const clientCompanyElement     = getByTestId('clientCompanyDetail');
  expect(clientCompanyElement).toHaveTextContent('Company Detail');
  const clientCompanyTable       = clientCompanyElement.querySelectorAll('tr td:last-child');        // table values only (not headings)
  const toMatchClientCompanyInfo = ['Jest Inc Private limited', 'ABC-345', '45MRT-1232', 'Boston'];
  clientCompanyTable.forEach((data, i)=>{
    expect(data).toHaveTextContent(`${toMatchClientCompanyInfo[i]}`);
  });

});
