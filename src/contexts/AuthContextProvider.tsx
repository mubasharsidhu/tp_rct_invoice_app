import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import { CircularProgress } from "@mui/material";
import { UsersAPI } from "../api/users";
import { ClientResponseModel } from "../containers/ClientDetailContainer/ClientDetailContainer";

export type AuthContextType = {
  authUserToken: string | null,
  login        : (token: string) => void,
  logout       : () => void
}

export const AuthContext = createContext<null | AuthContextType>(null);

export const useAuthContext = () => {
  const auth = useContext(AuthContext)
  if ( auth === null ) {
    throw new Error("Auth context is not initialised yet")
  }

  return auth;

}


const getMe = async (authUserToken: string) => {

  try {
    const response = await UsersAPI.me(authUserToken);
    return {
      type: "success" as string,
      me  : response as ClientResponseModel,
    }

  } catch (err: any) {

    return {
      type : "error" as string,
      error: err as any
    }

  }

}

const useUserAuth = () => {
  const router                            = useRouter();
  const [isLoading, setIsLoading]         = useState<boolean>(true);
  const [authUserToken, setAuthUserToken] = useState<null | string>(null);
  const [isCompanyAvailable, SetIsCompanyAvailable] = useState<boolean>(true);

  useEffect(() => {
    const userToken = getCookie("userToken") as string;
    if ( userToken ) {
      setAuthUserToken(userToken);

      const meResponse = getMe(userToken);
      meResponse.then((response) => {

        if (response.type==="error") { // the token is expired
          removeCookies('userToken');
          router.push('/login');
        }

        if (!response.me?.companyDetails ) {
          SetIsCompanyAvailable(false);
          // && router.pathname !== "/signup/company"
          //router.push(`signup/company`);
        }
      })
      .catch((err)=>{
        router.push("/login");
      });

      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }, [])

  if (!isCompanyAvailable && router.pathname !== "/signup/company") {
    router.push(`signup/company`);
  }

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