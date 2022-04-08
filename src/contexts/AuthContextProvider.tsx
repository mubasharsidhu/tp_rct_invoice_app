import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import { CircularProgress } from "@mui/material";

export type AuthContextType = {
  authUserToken: string | null,
  login: (token: string) => void,
  logout: () => void
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
  const [isLoading, setIsLoading]         = useState(true);
  const [authUserToken, setAuthUserToken] = useState<null | string>( null );

  useEffect(() => {
    const userToken = getCookie("userToken") as string;
    if ( userToken ) {
      setAuthUserToken(userToken);
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }, [])

  return {
    setAuthUserToken,
    authUserToken,
    isLoading
  }

}


export const AuthContextProvider = (props: {
  children?: ReactNode
}) => {

  const router                                         = useRouter();
  const { authUserToken, isLoading, setAuthUserToken } = useUserAuth();

  if ( isLoading ) {
    return (<><CircularProgress /></>)
  }

  return (
    <AuthContext.Provider value={{
      authUserToken,
      login: setAuthUserToken,
      logout: () => {
        removeCookies('userToken');
        router.push("/login");
      }
    }}>
      {props.children}
    </AuthContext.Provider>
  )

}