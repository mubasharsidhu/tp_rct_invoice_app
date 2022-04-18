import { InvoiceDetailContainer } from "../../../src/containers/InvoiceDetailContainer/InvoiceDetailContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";

export const ViewInvoice = () => {


  return (
    <AuthContextProvider>
      <Layout pageTitle={"View Invoice"} >
        <InvoiceDetailContainer />
      </Layout>
    </AuthContextProvider>
  )

}



export default ViewInvoice;
