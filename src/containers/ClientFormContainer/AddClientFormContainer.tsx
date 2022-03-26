import router from "next/router";
import { useContext } from "react";
import { ClientApi } from "../../api/clients";
import { AuthContext } from "../../contexts/AuthContextProvider";
import { AddClientForm } from "../../forms/AddClientForm/AddClientForm";

export const AddClientFormContainer = () => {
  const auth = useContext(AuthContext);
  return (
    <>
      <AddClientForm
        onClientDataSubmitRequest={async (clientData) => {
          if (!auth.authUserToken) {
            return;
          }
          try {
            const httpResponse = await ClientApi.createClient( auth.authUserToken, clientData );
            router.push("/clients")

          } catch (err) {
            console.log('err', err)
          }
        }}
      />
    </>
  )
}