import { ReactNode } from "react";
import { Button, Container, Grid, Stack } from "@mui/material";
import { Header } from "./Header";
import { useRouter } from "next/router";


type LayoutProps = {
  pageTitle: string,
  subMenus?: Array<{
    label: string;
    url  : string;
  }>,
  children?: ReactNode
}

const Layout = (props: LayoutProps ) => {

  const router = useRouter();

  return (
    <Container fixed>

      <Header />

      <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: "flex-end", pt:1 }}>
        <Button variant="outlined" onClick={()=>{ router.push('/') }} >Dashboard</Button>
        <Button variant="outlined" onClick={()=>{ router.push('/clients') }}>Clients</Button>
        <Button variant="outlined" onClick={()=>{ router.push('/invoices') }} >Invoices</Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item >
          <h2>{props.pageTitle}</h2>
        </Grid>

        {
          props.subMenus
          ?
          props.subMenus.map((data, index)=> {
            return (<Grid item key={index}>
              <Stack direction="row" spacing={2} sx={{ pt:2 }}>
                <Button variant="contained" onClick={()=>{ router.push( data.url ) }} >{data.label}</Button>
              </Stack>
            </Grid>)
          })
          : null
        }


      </Grid>

      {props.children}

    </Container>
  )

}

export default Layout;