
import { getCookie, setCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { LoginForm } from "../src/forms/LoginForm/LoginForm";

const LoginPage = () => {

  const router        = useRouter();
  const userAuthToken = getCookie("userToken") as string;
  if ( userAuthToken ) {
    router.push('/');
  }

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  return (
    <LoginForm
      genericError={errorMessage}
      onLoginRequest={function (data) {
        fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then( async (response) => {
          if (response.status === 200) {
            const jsonResponse = await response.json();
            setCookies('userToken', jsonResponse.token)
            router.push("/");
          } else {
            return Promise.reject(await response.text())
          }
        })
        .catch((err) => {
          console.log('err', err);
          if ( typeof err === 'string' ) {
            setErrorMessage(err)
          }
          else {
            setErrorMessage(err.toString())
          }
        });
      } }
      onNavigateToSignUp={() => {
        router.push("/signup");
      } }
    />
  )
}

export default LoginPage
