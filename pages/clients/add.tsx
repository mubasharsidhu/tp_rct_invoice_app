import { ClientFormContainer } from "../../src/containers/ClientFormContainer/ClientFormContainer";
import { AuthContextProvider } from "../../src/contexts/AuthContextProvider";
import Layout from "../../src/page-layout/Layout";

export const AddClient = () => {
  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"Add Client"}
        isSearchEnabled={false}
      >
        <ClientFormContainer formType={"add"} />
      </Layout>
    </AuthContextProvider>
  )
}

export default AddClient;
