import { useState } from "react";
import router from "next/router";
import { SignupForm } from "../src/forms/SignupForm/SignupForm";


export const SignupPage = () => {

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  return (
    <SignupForm
      genericError={errorMessage}
      onSignupRequest={function (data) {
        fetch("http://localhost:3139/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then( async (response) => {

          console.log('signup-response', response)

          if (response.status === 200) {
            const jsonResponse = await response.json();
            window.localStorage.setItem('userToken', jsonResponse.token);
            router.replace("/");
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