import { InvoiceFormContainer } from "../../src/containers/InvoiceFormContainer/InvoiceFormContainer";
import { AuthContextProvider } from "../../src/contexts/AuthContextProvider";
import Layout from "../../src/page-layout/Layout";


export const AddInvoice = () => {

  return (
    <AuthContextProvider>
      <Layout pageTitle={"Add Invoice"} >
        <InvoiceFormContainer formType={"add"} />
      </Layout>
    </AuthContextProvider>
  )

}


export default AddInvoice;
