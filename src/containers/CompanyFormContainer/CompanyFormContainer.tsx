import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CompanyValidationError, UsersAPI, UserValidationError } from "../../api/users";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { SignupCompanyForm, SignupCompanyInputs } from "../../forms/SignupForm/SignupCompanyForm";


type CompanyFormContainerProps = {
  formType: "add" | "edit"
}

export const CompanyFormContainer = (props: CompanyFormContainerProps) => {
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


  let currentDefaultForEdit: SignupCompanyInputs | undefined = undefined

  if (props.formType === "edit") {
    // This space in the first set of default values is necessary otherwise MUI do not set the CSS for defaultValue
    // and when useEffect fetches and return the new default values
    // the Label within the input and the defaultValue messes with eachother.
    currentDefaultForEdit = {
      companyName     : ' ',
      companyAddress  : ' ',
      companyTaxNumber: ' ',
      companyRegNumber: ' ',
      iban            : ' ',
      swift           : ' ',
    } as SignupCompanyInputs
  }

  const [currentData, setCurrentData] = useState<SignupCompanyInputs | undefined>(currentDefaultForEdit);

  useEffect(() => {
    if (authData.authUserToken && authData.meData && authData.meData.companyDetails) {
      currentDefaultForEdit = {
        companyName     : authData.meData.companyDetails.name,
        companyAddress  : authData.meData.companyDetails.address,
        companyTaxNumber: authData.meData.companyDetails.vatNumber,
        companyRegNumber: authData.meData.companyDetails.regNumber,
        iban            : authData.meData.companyDetails.iban,
        swift           : authData.meData.companyDetails.swift,
      } as SignupCompanyInputs
    }
    setCurrentData(currentDefaultForEdit);
  }, [authData.meData]);

  return (
    <>
      <SignupCompanyForm
        genericError={errorMessage}
        formType={props.formType}
        currentData={currentData}
        onSignupCompanySubmit={onSignupCompanySubmit}
      />
    </>
  )

}


