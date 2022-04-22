import { useRouter } from "next/router";
import { useState } from "react";
import { CompanyValidationError, UsersAPI, UserValidationError } from "../../api/users";
import { BackdropLoader } from "../../components/BackdropLoader/BackdropLoader";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { SignupCompanyForm, SignupCompanyInputs } from "../../forms/SignupForm/SignupCompanyForm";


export const CompanyFormContainer = () => {
  const router                          = useRouter();
  const authData                        = useAuthContext();
  const authUserToken                   = authData.authUserToken;
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

  if ( authData.meData?.companyDetails ) {
    return (<BackdropLoader />)
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


