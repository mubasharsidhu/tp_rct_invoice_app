import { useState } from "react";
import { useRouter } from "next/router";
import { SignupForm } from "../src/forms/SignupForm/SignupForm";
import { getCookie, setCookies } from "cookies-next";


export const SignupPage = () => {

  const router        = useRouter();
  const userAuthToken = getCookie("userToken") as string;
  if ( userAuthToken ) {
    router.push('/');
  }

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  return (
    <SignupForm
      genericError={errorMessage}
      onSignupRequest={function (data) {
        fetch(`${process.env.NEXT_PUBLIC_INVOICE_API_HOST}/register`, {
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
          }
          else {
            return Promise.reject(await response.text())
          }

        })
        .catch((err) => {
          if ( typeof err === 'string' ) {
            setErrorMessage(err)
          }
          else {
            setErrorMessage(err.toString())
          }
        });
      }}
      onNavigateToLogin={() => {
        router.push("/login");
      } }
    />
  )

}

export default SignupPage
