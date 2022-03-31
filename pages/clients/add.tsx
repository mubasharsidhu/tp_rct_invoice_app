import { AddClientFormContainer } from "../../src/containers/ClientFormContainer/AddClientFormContainer";
import { AuthContextProvider } from "../../src/contexts/AuthContextProvider";
import Layout from "../../src/page-layout/Layout";

export const AddClient = () => {
  return (
    <AuthContextProvider>
      <Layout pageTitle={"Add Client"}>
        <AddClientFormContainer />
      </Layout>
    </AuthContextProvider>
  )
}

export default AddClient;
