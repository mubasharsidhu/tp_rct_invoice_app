
import { useRouter } from "next/router";
import { useState } from "react";
import { LoginForm } from "../src/forms/LoginForm/LoginForm";

const LoginPage = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  return (
    <LoginForm
      genericError={errorMessage}
      onLoginRequest={function (data) {
        fetch("http://localhost:3139/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
        .then( async (response) => {
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
      } }
      onNavigateToSignUp={() => {
        router.push("/signup");
      } }
    />
  )
}

export default LoginPage