import { ClientDetailContainer } from "../../../src/containers/ClientDetailContainer/ClientDetailContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";


export const ViewClient = () => {

  return (
    <AuthContextProvider>
      <Layout pageTitle={"View Client"} pageID={"client-detail-page"}>
        <ClientDetailContainer />
      </Layout>
    </AuthContextProvider>
  )

}


export default ViewClient;
