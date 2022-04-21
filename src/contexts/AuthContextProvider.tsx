import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import { CircularProgress, Stack } from "@mui/material";
import { MeResponseModel, UserJobs } from "../api/users";

export type AuthContextType = {
  authUserToken: string | null,
  login        : (token: string) => void,
  logout       : () => void,
  meData       : MeResponseModel | undefined
}

export const AuthContext = createContext<null | AuthContextType>(null);

export const useAuthContext = () => {
  const auth = useContext(AuthContext)
  if ( auth === null ) {
    throw new Error("Auth context is not initialised yet")
  }

  return auth;

}


const useUserAuth = () => {

  const router                            = useRouter();
  const [isLoading, setIsLoading]         = useState<boolean>(true);
  const [authUserToken, setAuthUserToken] = useState<null | string>(null);
  const [meData, setMeData]               = useState<MeResponseModel | undefined>(undefined);

  useEffect(() => {

    let abortController = new AbortController();

    const userToken = getCookie("userToken") as string;
    if ( userToken ) {
      setAuthUserToken(userToken);

      const meResponse = UserJobs.getMe(userToken);
      meResponse.then((response) => {

        if (response.success) {
          setMeData(response.me);
          if ( response.me && response.me.companyDetails === null ) {
            router.push(`/signup/company`);
          }
        }
        else { // the token is expired
          removeCookies('userToken');
          router.push('/login');
        }

      })
      .catch((err)=>{
        //setMeData is already undefined here
        router.push('/login');
      });

      setIsLoading(false);
    } else {
      router.push("/login");
    }

    return () => {
      abortController.abort();
    }

  }, [])

  return {
    setAuthUserToken,
    authUserToken,
    isLoading,
    meData
  }

}


export const AuthContextProvider = (props: {
  children?: ReactNode
}) => {

  const router                                                 = useRouter();
  const { authUserToken, isLoading, setAuthUserToken, meData } = useUserAuth();

  if ( isLoading ) {
    return (<><Stack alignItems="center"><CircularProgress /></Stack></>)
  }

  return (
    <AuthContext.Provider value={{
      authUserToken,
      meData,
      login : setAuthUserToken,
      logout: () => {
        removeCookies('userToken');
        router.push("/login");
      }
    }}>
      {props.children}
    </AuthContext.Provider>
  )

}