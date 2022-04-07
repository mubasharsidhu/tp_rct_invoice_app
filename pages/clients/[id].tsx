import { ClientFormContainer as ClientFormContainer } from "../../src/containers/ClientFormContainer/ClientFormContainer";
import { AuthContextProvider } from "../../src/contexts/AuthContextProvider";
import Layout from "../../src/page-layout/Layout";

export const EditClient = () => {

  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"Edit Client"}
        isSearchEnabled={false}
      >
        <ClientFormContainer formType={"edit"}/>
      </Layout>
    </AuthContextProvider>
  )

}

export default EditClient;
