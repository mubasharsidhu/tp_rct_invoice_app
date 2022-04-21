
type LoginInputs = {
  email: string,
  password: string,
};

type SignupInputs = {
  name           : string,
  email          : string,
  password       : string,
  confirmPassword: string
};

export class UserValidationError extends Error {}

export const AuthAPI = {

  login: async (data: LoginInputs) => {
    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if ( httpResponse.status >= 400 ) {
      throw new UserValidationError( await httpResponse.text() );
    }

    try {
      const jsonResponse = await httpResponse.json();
      return jsonResponse as {
        user_id: string,
        email: string,
        name: string,
        token: string,
      }
    } catch (err) {
      return {
        user_id: '',
        email: '',
        name: '',
        token: '',
      }
    }

  },

  signup: async (data: SignupInputs) => {
    const httpResponse = await fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if ( httpResponse.status >= 400 ) {
      throw new UserValidationError( await httpResponse.text() );
    }

    try {
      const jsonResponse = await httpResponse.json();
      return jsonResponse as { user_id: String }
    } catch (err) {
      return { user_id: null }
    }

  }

}