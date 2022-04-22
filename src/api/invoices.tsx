import { ServerResponse } from "http";
import { DEFAULT_ROWS_PER_PAGE } from "../config/config";


export type Order         = 'asc' | 'desc';
export type InvoiceSortBy = 'clientName' | 'invoiceNumber' | 'dueDate' | 'value';

export type InvoiceInputParams = {
  id?           : string,
  clientID      : string,
  invoiceDate   : Date,
  invoiceDueDate: Date,
  invoiceNumber : string,
  projectCode   : string,
  totalValue    : number,
  items         : Array<{
    item : string,
    price: number,
  }>,
}

export class InvalidUserTokenError extends Error {}
export class InvoiceValidationError extends Error {}
export class InvalidInvoiceIDError extends Error {}

export type InvoiceResponseModel = {
  client: {
    id            : string,
    name          : string,
    user_id       : string,
    email         : string,
    companyDetails: {
      name     : string,
      address  : string,
      vatNumber: string,
      regNumber: string,
    };
  },
  invoice: {
    id            : string,
    userID        : string,
    client_id     : string,
    date          : Date,
    dueDate       : Date,
    invoice_number: string,
    value         : number,
    projectCode?  : number,
    meta          : Array<{item: string, price: number}>
  }
}


export type InvoiceDetailResponseModel = {
  id            : string,
  user_id       : string,
  client_id     : string,
  date          : Date,
  dueDate       : Date,
  invoice_number: string,
  value         : number,
  projectCode?  : string,
  meta          : Array<{item: string, price: number}>
}


export const InvoiceAPI = {

  manageInvoice: async (
    authToken: string,
    formType : "add" | "edit",
    params   : InvoiceInputParams
  ) => {
    const payload = {
      id            : params.id,
      invoice_number: params.invoiceNumber,
      client_id     : params.clientID,
      projectCode   : params.projectCode,
      date          : params.invoiceDate,
      dueDate       : params.invoiceDueDate,
      value         : params.totalValue,
      meta          : params.items
    }

    if ( formType === "add" ) {
      delete payload.id;
    }

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/invoices`, {
      method: formType === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if ( httpResponse.status === 401 ) {
      throw new InvalidUserTokenError( await httpResponse.text() );
    }
    if ( httpResponse.status === 404 ) {
      throw new InvoiceValidationError( await httpResponse.text() );
    }
    if ( httpResponse.status === 500 ) {
      throw new InvoiceValidationError( await httpResponse.text() );
    }

    const jsonResponse = await httpResponse.json();
    return;

  },


  getInvoiceByID: async (authToken: string, params: {
    invoiceID: string
  }) => {

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/invoices/${params.invoiceID}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });

    if ( httpResponse.status === 401 ) {
      throw new InvalidUserTokenError('Invalid access: Login again');
    }
    if ( httpResponse.status === 404 ) {
      throw new InvalidInvoiceIDError('No Invoice Found with this ID');
    }

    try {

      const jsonReponse = await httpResponse.json();
      return jsonReponse as {
        type   : "success",
        invoice: InvoiceDetailResponseModel
      }

    } catch (err) {

      return {
        invoice: {}
      }

    }

  },


  getInvoices: async (authToken: string, params: {
    res?     : ServerResponse,
    order    : Order,
    orderBy  : InvoiceSortBy,
    limit?   : number,
    offset?  : number,
    clientID?: string
  }) => {
    // TODO check and allow non filtered or sorted use

    const queryParams = {
      filter: {
        clientId: params.clientID
      },
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

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/invoices?params=${encodeParamsString}`, {
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
        type    : "success",
        invoices: InvoiceResponseModel[],
        total   : number
      }

    } catch (err) {

      return {
        total: 0,
        invoices: []
      }

    }

  }

}



export const InvoiceJobs = {

  getInvoices : async (params: {
    authUserToken: string,
    orderBy      : InvoiceSortBy,
    order        : Order,
    limit?       : number,
    offset?      : number,
    clientID?    : string,
  }) => {

    try {
      const invoiceResponse = await InvoiceAPI.getInvoices(params.authUserToken, {
        order   : params.order,
        orderBy : params.orderBy,
        limit   : params.limit ? params.limit: DEFAULT_ROWS_PER_PAGE,
        offset  : params.offset,
        clientID: params.clientID,
      });

      return {
        type    : "success" as string,
        invoices: invoiceResponse.invoices as InvoiceResponseModel[],
        total   : invoiceResponse.total as number,
      }

    } catch (err) {

      return {
        type : "error" as string,
        error: err as any
      }

    }

  },


  getInvoiceByID : async (params: {
    authUserToken: string,
    invoiceID    : string
  }) => {

    try {
      const invoiceResponse = await InvoiceAPI.getInvoiceByID(params.authUserToken, {
        invoiceID: params.invoiceID
      });

      return {
        type   : "success" as string,
        invoice: invoiceResponse.invoice as InvoiceDetailResponseModel,
      }

    } catch (err: unknown) {

      return {
        type : "error" as string,
        error: err as InvalidUserTokenError | InvalidInvoiceIDError
      }

    }

  }


}