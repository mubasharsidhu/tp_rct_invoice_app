import { InvoiceFormContainer as InvoiceFormContainer } from "../../src/containers/InvoiceFormContainer/InvoiceFormContainer";
import { AuthContextProvider } from "../../src/contexts/AuthContextProvider";
import Layout from "../../src/page-layout/Layout";

export const EditInvoice = () => {

  return (
    <AuthContextProvider>
      <Layout pageTitle={"Edit Invoice"} >
        <InvoiceFormContainer formType={"edit"}/>
      </Layout>
    </AuthContextProvider>
  )

}

export default EditInvoice;
