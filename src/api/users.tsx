type SignupCompanyInputs = {
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
  iban            : string,
  swift           : string,
};


export type MeResponseModel = {
  id            : string,
  email         : string,
  name          : string,
  password      : string,
  companyDetails: {
    name     : string,
    address  : string,
    vatNumber: string,
    regNumber: string,
    iban?    : string,
    swift?   : string,
  };
}

export class UserValidationError extends Error {}
export class CompanyValidationError extends Error {}

export const UsersAPI = {

  me: async (authToken: string) => {
    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/me`, {
      method: "GET",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${authToken}`
      },
    });

    if ( httpResponse.status === 401 ) {
      throw new UserValidationError( await httpResponse.text() );
    }

    try {
      const jsonResponse = await httpResponse.json();
      return {
        success: true,
        me     : jsonResponse
      } as {
        success: boolean,
        me     : MeResponseModel
      }
    } catch (err) {
      return {
        success: false as boolean,
        me     : null
      }
    }

  },


  companyDetails: async (authToken: string, params: SignupCompanyInputs) => {

    const payload = {
      name     : params.companyName,
      address  : params.companyAddress,
      vatNumber: params.companyTaxNumber,
      regNumber: params.companyRegNumber,
      iban     : params.iban,
      swift    : params.swift,
    }

    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/me/company`, {
      method: "PUT",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if ( httpResponse.status === 401 ) {
      throw new UserValidationError( await httpResponse.text() );
    }

    if ( httpResponse.status === 400 ) {
      throw new CompanyValidationError( await httpResponse.text() );
    }

    try {
      const jsonResponse = await httpResponse.json();
      return jsonResponse as {
        success: boolean,
        user   : MeResponseModel
      }
    } catch (err) {
      return {
        success: false,
        user   : null
      }
    }

  }

}



export const UserJobs = {
  getMe : async (authUserToken: string) => {

    try {

      const response = await UsersAPI.me(authUserToken);
      return {
        success: response.success as boolean,
        me     : response.me as MeResponseModel,
      }

    } catch (err: unknown) {

      return {
        success: false as boolean,
        error  : err as unknown
      }

    }

  }
}
