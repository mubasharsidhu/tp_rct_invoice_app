import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ClientAPI, InvalidUserIDError, InvalidUserTokenError } from "../../api/clients"
import { ClientDetail } from "../../components/Clients/ClientDetail"
import { useAuthContext } from "../../contexts/AuthContextProvider"


export const getClientByIDHandler = async (params: {
  authUserToken: string,
  clientID     : string
}) => {

  try {
    const clientResponse = await ClientAPI.getClientsByID(params.authUserToken, {
      clientID : params.clientID
    });

    return {
      type   : "success" as string,
      client: clientResponse.client as ClientResponseModel,
    }

  } catch (err: unknown) {

    return {
      type : "error" as string,
      error: err as InvalidUserTokenError | InvalidUserIDError
    }

  }

}


export type ClientResponseModel = {
  id            : string;
  email         : string;
  name          : string;
  totalBilled   : number;
  invoicesCount : number;
  companyDetails: {
    name     : string;
    address  : string;
    vatNumber: string;
    regNumber: string;
  };
}


export const ClientDetailContainer = () => {

  const router                            = useRouter();
  const authUserToken                     = useAuthContext().authUserToken;
  const clientID                          = router.query.id as string;
  const [currentClient, setCurrentClient] = useState<ClientResponseModel | undefined>();
  const [errorMessage, setErrorMessage]   = useState<string | undefined>();

  useEffect(() => {
    if ( authUserToken === null || !clientID ) {
      return;
    }
    const clientsHandlerResponse = getClientByIDHandler({
      authUserToken: authUserToken,
      clientID     : clientID
    });

    clientsHandlerResponse.then((response) => {

      if ( response.type === "error" ) {
        if ( typeof response.error === 'string' ) {
          setErrorMessage(response.error);
        }
        else {
          const errorObj = response.error as object;
          setErrorMessage( errorObj.toString() );
        }
      }
      else {
        setErrorMessage(""); // resetting the error message if it was there before
        setCurrentClient(response.client as ClientResponseModel);
      }

    })

  }, [authUserToken, clientID]);

  return (
    <>
      <ClientDetail
        genericError={errorMessage}
        currentClient={currentClient}
      />
    </>
  )
}
