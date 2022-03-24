import { AddClientFormContainer } from "../../src/containers/ClientFormContainer/AddClientFormContainer";
import { AuthContextProvider } from "../../src/contexts/AuthContextProvider";

export const AddClient = () => {
  return (
    <AuthContextProvider>
      <AddClientFormContainer />
    </AuthContextProvider>
  )
}

export default AddClient;
