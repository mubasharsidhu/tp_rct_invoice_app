
import { getCookie, setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { AuthAPI } from "../src/api/auth";
import { LoginForm, LoginInputs } from "../src/forms/LoginForm/LoginForm";

const LoginPage = () => {

  const router        = useRouter();
  const userAuthToken = getCookie("userToken") as string;
  if ( userAuthToken ) {
    router.push('/');
  }

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const onLoginRequest = async (data: LoginInputs) => {

    try {

      const response = await AuthAPI.login(data);
      setCookies('userToken', response.token);
      window.localStorage.setItem("userName", response.name);
      router.push("/");

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
    <LoginForm
      genericError={errorMessage}
      onLoginRequest={onLoginRequest}
      onNavigateToSignUp={() => {
        router.push("/signup");
      } }
    />
  )
}

export default LoginPage
