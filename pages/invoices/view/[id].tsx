import { Print } from "@mui/icons-material";
import type { GenericMenuItemProps } from "../../../src/components/Generic/GenericMenuItem";
import { InvoiceDetailContainer } from "../../../src/containers/InvoiceDetailContainer/InvoiceDetailContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";


const subMenus: Array<GenericMenuItemProps> = [
  {
    title      : "Print Invoice",
    icon       : <Print fontSize="small" />,
    redirectURL: `/invoices/print`
  }
];


export const ViewInvoice = () => {

  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"View Invoice"}
        subMenus={subMenus}
      >
        <InvoiceDetailContainer />
      </Layout>
    </AuthContextProvider>
  )

}



export default ViewInvoice;
