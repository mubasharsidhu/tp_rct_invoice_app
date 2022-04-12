import { useRouter } from "next/router";
import {  useState } from "react";
import { ClientAPI, ClientValidationError } from "../../api/clients";
import { CompanyValidationError, UsersAPI, UserValidationError } from "../../api/users";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { SignupCompanyForm, SignupCompanyInputs } from "../../forms/SignupForm/SignupCompanyForm";


export const CompanyFormContainer = () => {
  const router                          = useRouter();
  const authUserToken                   = useAuthContext().authUserToken;
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const onSignupCompanySubmit           = async (companyData: SignupCompanyInputs) => {

    if (! authUserToken) {
      return;
    }

    try {

      const httpResponse = await UsersAPI.companyDetails(authUserToken, companyData);

      if (httpResponse.success && httpResponse.user?.companyDetails) {
        router.push("/");
      }
      else {
        throw new Error("An unknown error occured");
      }

    } catch (err: unknown) {

      if ( err instanceof UserValidationError || err instanceof CompanyValidationError ) {
        if ( typeof err === 'string' ) {
          setErrorMessage(err);
        }
        else {
          setErrorMessage(err.toString());
        }
      }
      else {
        setErrorMessage('An unknown error occured');
      }

    }

  }

  return (
    <>
      <SignupCompanyForm
        genericError={errorMessage}
        onSignupCompanySubmit={onSignupCompanySubmit}
      />
    </>
  )
}


