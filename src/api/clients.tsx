import { ServerResponse } from "http";


export type Order = 'asc' | 'desc';

export type ClientSortBy = {
  clientName: string,
  email: string
}

export type clientParams = {
  email           : string,
  clientName      : string,
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
}

export class InvalidUserTokenError extends Error {}

export type ClientResponseModel = {
  id: string;
  email: string;
  name: string;
  totalBilled: number;
  invoicesCount: number;
  companyDetails: {
      name: string;
      address: string;
      vatNumber: string;
      regNumber: string;
  };
}


export const ClientAPI = {
  createClient: async (authToken: string, params: clientParams) => {
    const payload = {
      email: params.email,
      name: params.clientName,
      companyDetails: {
        name     : params.companyName,
        address  : params.companyAddress,
        vatNumber: params.companyTaxNumber,
        regNumber: params.companyRegNumber
      }
    }

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    const jsonResponse = await httpResponse.json();

  },

  getClients: async (authToken: string, params: {
    res?   : ServerResponse,
    order  : Order,
    orderBy: keyof ClientSortBy,
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
      throw new InvalidUserTokenError('Invalid Token')
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