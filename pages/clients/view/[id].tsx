import { ClientDetailContainer } from "../../../src/containers/ClientDetailContainer/ClientDetailContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";

export const ViewClient = () => {


  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"View Client"}
        isSearchEnabled={false}
      >

        <ClientDetailContainer />
      </Layout>
    </AuthContextProvider>
  )

}



export default ViewClient;
