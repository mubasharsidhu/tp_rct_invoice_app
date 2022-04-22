import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCookie, removeCookies } from "cookies-next";
import { MeResponseModel, UserJobs } from "../api/users";
import { BackdropLoader } from "../components/BackdropLoader/BackdropLoader";

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

    const userToken = getCookie("userToken") as string;
    if ( userToken ) {
      setAuthUserToken(userToken);
      setIsLoading(false);
    } else {
      router.push("/login");
    }

  }, [])


  useEffect(()=>{

    if (!authUserToken) {
      return
    }
    let isEffectActive = true;

    const meResponse = UserJobs.getMe(authUserToken);
    meResponse.then(async (response) => {

      if ( isEffectActive ) {
        if (response.success) {
          setMeData(await response.me as MeResponseModel);

          if ( response.me && response.me.companyDetails === null ) {
            router.push(`/signup/company`);
          }
          else {
            if (router.asPath === `/signup/company`) {
              //router.push(`/`);
            }
          }
        }
        else { // the token is expired
          removeCookies('userToken');
          router.push('/login');
        }
      }

    })
    .catch((err: unknown)=>{
      //meData is not available, let's redirect to login
      router.push('/login');
    });

    return () => { isEffectActive = false }

  }, [authUserToken]);


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
    return (<BackdropLoader />)
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
