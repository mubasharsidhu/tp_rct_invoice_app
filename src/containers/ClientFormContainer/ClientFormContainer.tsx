import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClientAPI, ClientValidationError, InvalidUserIDError, InvalidUserTokenError } from "../../api/clients";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { ClientForm as ClientForm, ClientInputParams } from "../../forms/ClientForm/ClientForm";
import { ClientResponseModel } from "../ClientTableContainer/ClientTableContainer";


const getClientByIDHandler = async (params: {
  authUserToken: string,
  clientID      : string
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

type ClientFormContainerProps = {
  formType: "add" | "edit"
}

export const ClientFormContainer = (props: ClientFormContainerProps) => {
  const router                          = useRouter();
  const authUserToken                   = useAuthContext().authUserToken;
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const clientID                        = router.query.id as string;

  let defaultCurrentClient: ClientInputParams | undefined;
  if ( props.formType === "edit" ) {
    // This space in the first set of default values is necessary otherwise MUI do not set the CSS for defaultValue
    // and when useEffect fetches and return the new default values
    // the Label within the input and the defaultValue messes with eachother.
    defaultCurrentClient = {
      id              : ' ',
      clientName      : ' ',
      email           : ' ',
      companyName     : ' ',
      companyAddress  : ' ',
      companyTaxNumber: ' ',
      companyRegNumber: ' '
    }
  }


  const [currentClient, setCurrentClient] = useState<ClientInputParams | undefined>(defaultCurrentClient);

  if ( props.formType === 'edit' ) {

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
          const theClient = {
            id              : response.client?.id,
            clientName      : response.client?.name,
            email           : response.client?.email,
            companyName     : response.client?.companyDetails.name,
            companyAddress  : response.client?.companyDetails.address,
            companyTaxNumber: response.client?.companyDetails.vatNumber,
            companyRegNumber: response.client?.companyDetails.regNumber
          }
          setErrorMessage(""); // resetting the error message if it was there before
          setCurrentClient(theClient as ClientInputParams);
        }

      })

    }, [authUserToken, clientID]);
  }

  return (
    <>
      <ClientForm
        genericError={errorMessage}
        currentClient={currentClient}
        formType={props.formType}
        onClientDataSubmitRequest={ async (clientData) => {

          if (! authUserToken) {
            return;
          }

          try {

            const httpResponse = await ClientAPI.manageClient( authUserToken, props.formType, clientData );
            router.push("/clients");

          } catch (err: unknown) {

            if ( err instanceof ClientValidationError ) {
              if ( typeof err === 'string' ) {
                setErrorMessage(err);
              }
              else {
                setErrorMessage(err.toString());
              }
            }

          }

        }}

      />
    </>
  )
}


