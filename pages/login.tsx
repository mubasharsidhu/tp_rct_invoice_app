
import { getCookie, setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AuthAPI } from "../src/api/auth";
import { BackdropLoader } from "../src/components/BackdropLoader/BackdropLoader";
import { LoginForm, LoginInputs } from "../src/forms/LoginForm/LoginForm";

const LoginPage = () => {

  const router        = useRouter();
  const userAuthToken = getCookie("userToken") as string;

  useEffect(()=>{
    if ( userAuthToken ) {
      router.push('/');
    }
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const onLoginRequest = async (data: LoginInputs) => {

    try {

      const response = await AuthAPI.login(data);
      setCookies('userToken', response.token);
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

  const [backdropLoader, setBackdropLoader] = useState<boolean>(false);
  useEffect(() => {
    if (userAuthToken) {
      setBackdropLoader(true);
    }
  }, [])
  if ( backdropLoader ) {
    return (<BackdropLoader />)
  }

  return (
    <>
      <LoginForm
        genericError={errorMessage}
        onLoginRequest={onLoginRequest}
        onNavigateToSignUp={() => {
          router.push("/signup");
        } }
      />
    </>
  )
}

export default LoginPage
