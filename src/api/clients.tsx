import { ServerResponse } from "http";
import { DEFAULT_ROWS_PER_PAGE } from "../../pages/config/config";


export type Order        = 'asc' | 'desc';
export type ClientSortBy = 'clientName' | 'invoicesCount';

export type ClientInputParams = {
  id?             : string,
  email           : string,
  clientName      : string,
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
}

export class InvalidUserTokenError extends Error {}
export class ClientValidationError extends Error {}
export class InvalidClientIDError extends Error {}

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


export const ClientAPI = {

  manageClient: async (
    authToken: string,
    formType : "add" | "edit",
    params   : ClientInputParams
  ) => {
    const payload = {
      id            : params.id,
      email         : params.email,
      name          : params.clientName,
      companyDetails: {
        name     : params.companyName,
        address  : params.companyAddress,
        vatNumber: params.companyTaxNumber,
        regNumber: params.companyRegNumber
      }
    }

    if ( formType === "add" ) {
      delete payload.id;
    }

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/clients`, {
      method: formType === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if ( httpResponse.status >= 400 ) {
      throw new ClientValidationError( await httpResponse.text() );
    }

    const jsonResponse = await httpResponse.json();

  },

  getClientsByID: async (authToken: string, params: {
    clientID: string
  }) => {

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/clients/${params.clientID}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });

    if ( httpResponse.status === 401 ) {
      throw new InvalidUserTokenError('Invalid access: Login again');
    }
    if ( httpResponse.status === 404 ) {
      throw new InvalidClientIDError('No Client Found with this ID');
    }

    try {

      const jsonReponse = await httpResponse.json();

      return jsonReponse as {
        type: "success",
        client: ClientResponseModel
      }

    } catch (err) {

      return {
        client: {}
      }

    }

  },

  getClients: async (authToken: string, params: {
    res?   : ServerResponse,
    order  : Order,
    orderBy: ClientSortBy,
    limit? : number,
    offset?: number
  }) => {
    // TODO check and allow non filtered or sorted use

    const queryParams = {
      sort: {
        [params.orderBy]: params.order,
      },
      limit: params.limit,
      offset: params.offset
    }

    if ( queryParams.limit === -1 ) {
      delete queryParams.limit;
      delete queryParams.offset;
    }

    const encodeParamsString = encodeURIComponent(JSON.stringify(queryParams));

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/clients?params=${encodeParamsString}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });

    if ( httpResponse.status === 401 ) {
      throw new InvalidUserTokenError('Invalid Access')
    }


    try {

      const jsonReponse = await httpResponse.json();
      return jsonReponse as {
        type: "success",
        total: number,
        clients: ClientResponseModel[]
      }

    } catch (err) {

      return {
        total: 0,
        clients: []
      }

    }

  }

}


export const ClientJobs = {

  getClients: async (params: {
    authUserToken: string,
    orderBy      : ClientSortBy,
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

  },

  getClientByID: async (params: {
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
        error: err as InvalidUserTokenError | InvalidClientIDError
      }

    }

  }

}