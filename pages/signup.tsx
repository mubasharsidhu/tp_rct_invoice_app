import { useState } from "react";
import { useRouter } from "next/router";
import { SignupForm, SignupInputs } from "../src/forms/SignupForm/SignupForm";
import { getCookie, setCookies } from "cookies-next";
import { AuthAPI, UserValidationError } from "../src/api/auth";


export const SignupPage = () => {

  const router        = useRouter();
  const userAuthToken = getCookie("userToken") as string;
  if ( userAuthToken ) {
    //router.push('/');
  }

  const [errorMessage, setErrorMessage] = useState<string | undefined>();


  const onSignupRequest = async (data: SignupInputs) => {

    try {
      const response = await AuthAPI.signupUserStep1(data);

      console.log(response)
      //setCookies('userToken', jsonResponse.token);
      //router.push("/");

    } catch (err: any) {

      if ( typeof err === 'string' ) {
        setErrorMessage(err);
      }
      else {
        setErrorMessage(err.toString());
      }

    }

  }


  return (
    <SignupForm
      genericError={errorMessage}
      onSignupRequest={onSignupRequest}
      onNavigateToLogin={() => {
        router.push("/login");
      } }
    />
  )

}

export default SignupPage
