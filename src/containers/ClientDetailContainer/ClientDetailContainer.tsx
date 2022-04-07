import { Box, Paper} from "@mui/material"
import { useRouter } from "next/router"
import { memo, useEffect, useState } from "react"
import type { searchOptionType } from "../../../pages/clients"
import { DEFAULT_ROWS_PER_PAGE } from "../../../pages/config/config"
import { ClientAPI, InvalidUserIDError, InvalidUserTokenError } from "../../api/clients"
import { ClientDetail } from "../../components/Clients/ClientDetail"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"
import { useAuthContext } from "../../contexts/AuthContextProvider"


export const getClientByIDHandler = async (params: {
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

export type ClientDetailContainerProps = {
 /*  initialPayload?: {
    clients       : ClientResponseModel[],
    total         : number,
    searchOptions?: searchOptionType
  },
  pagination?: boolean, */
}


export const getClientsHandler = async (params: {
  authUserToken: string,
  orderBy      : keyof ClientSortBy,
  order        : Order,
  limit?       : number,
  offset?      : number
}) => {

  try {
    const clientResponse = await ClientAPI.getClients(params.authUserToken, {
      order  : params.order,
      orderBy: params.orderBy,
      limit  : params.limit ? params.limit : DEFAULT_ROWS_PER_PAGE,
      offset : params.offset
    });

    return {
      type   : "success" as string,
      clients: clientResponse.clients as ClientResponseModel[],
      total  : clientResponse.total as number
    }

  } catch (err) {

    return {
      type : "error" as string,
      error: err as any
    }

  }

}


export const ClientDetailContainer = () => {

  const router                          = useRouter();
  const authUserToken                   = useAuthContext().authUserToken;
  const clientID                        = router.query.id as string;
  const [currentClient, setCurrentClient] = useState<ClientResponseModel | undefined>();

  const [errorMessage, setErrorMessage] = useState<string | undefined>();


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
