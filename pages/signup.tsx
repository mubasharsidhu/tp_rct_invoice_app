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
      const signupResponse = await AuthAPI.signup(data);

      const payload = {
        email   : data.email,
        password: data.password
      }
      const response = await AuthAPI.login(payload);

      setCookies('userToken', response.token);
      router.push(`/signup/company`);

    } catch (err: unknown) {

      if ( err instanceof UserValidationError) {
        if ( typeof err === 'string' ) {
          setErrorMessage(err);
        }
        else {
          setErrorMessage(err.toString());
        }
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
