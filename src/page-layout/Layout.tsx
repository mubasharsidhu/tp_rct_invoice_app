import { ReactNode } from "react";
import { Backdrop, Button, CircularProgress, Container, Grid, Stack, Typography } from "@mui/material";
import { Header } from "./Header";
import { useRouter } from "next/router";
import { Footer } from "./Footer";
import { GenericMenuItemProps } from "../components/Generic/GenericMenuItem";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { BackdropLoader } from "../components/BackdropLoader/BackdropLoader";


type LayoutProps = {
  hideMenu?: boolean,
  pageTitle     : string,
  subMenus?     : Array<GenericMenuItemProps>,
  children?     : ReactNode,
}

const Layout = (props: LayoutProps ) => {

  const router   = useRouter();
  const authData = useAuthContext();

  if ( !authData.meData?.companyDetails && router.asPath !== `/signup/company` ) {
    return (<BackdropLoader />)
  }

  return (
    <Container fixed>
      <Header />

      {
        props.hideMenu
        ? null
        : <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: "flex-end", pt:1 }}>
            <Button variant="outlined" onClick={()=>{ router.push('/') }} >Dashboard</Button>
            <Button variant="outlined" onClick={()=>{ router.push('/clients') }}>Clients</Button>
            <Button variant="outlined" onClick={()=>{ router.push('/invoices') }} >Invoices</Button>
          </Stack>
      }

      <Grid container spacing={2} sx={{py:1}}>
        <Grid item >
          <Typography component="h1" variant="h4">{props.pageTitle}</Typography>
        </Grid>

        {
          props.subMenus
          ?
          props.subMenus.map((data, index)=> {
            return (
              <Grid item key={index}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={data.clickHandler ? data.clickHandler : ()=>{ router.push( data.redirectURL ) }} >{data.icon}{data.title}</Button>
                </Stack>
              </Grid>
            )
          })
          : null
        }

      </Grid>

      {props.children}

      <Footer />
    </Container>
  )

}

export default Layout;
