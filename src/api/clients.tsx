export type clientParams = {
  email           : string,
  clientName      : string,
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
}


export const ClientApi = {
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
    console.log(payload);
    const httpResponse = await fetch(`http://localhost:3139/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });


    const jsonResponse = await httpResponse.json();
    console.log(jsonResponse);


  }
}