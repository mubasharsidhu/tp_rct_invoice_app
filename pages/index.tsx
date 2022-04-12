import { Grid, Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { ClientAPI, ClientResponseModel, InvalidUserTokenError } from '../src/api/clients'
import { ClientTableContainer } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import Layout from '../src/page-layout/Layout'
import { DEFAULT_ROWS_PER_PAGE } from './config/config'


type ClientPageProps = {
  clients: ClientResponseModel[],
  total  : number
}


const Home: NextPage<ClientPageProps> = (props) => {
  return (
    <AuthContextProvider>
      <Layout pageTitle='Dashboard'>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Typography>Clients</Typography>
            <ClientTableContainer initialPayload={props}/>
          </Grid>
          <Grid item xs={6}>
            <Typography>Invoices (To be implemented...)</Typography>
            <ClientTableContainer initialPayload={props}/>
          </Grid>
        </Grid>
      </Layout>
    </AuthContextProvider>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {

  const userAuthToken  = context.req.cookies.userToken as string;
  const { res }        = context;

  try {

    const clientResponse = await ClientAPI.getClients(userAuthToken, {
      res,
      order  : "asc",
      orderBy: "clientName",
      limit  : DEFAULT_ROWS_PER_PAGE,
      offset : (parseInt(context.query?.page as string, 10) - 1 ?? 1) * DEFAULT_ROWS_PER_PAGE
    });

    return {
      props: {
        clients: clientResponse.clients,
        total: clientResponse.total
      }, // will be passed to the page component as props
    }

  } catch (err) {

    if ( err instanceof InvalidUserTokenError) {
      context.res.setHeader(
        "Set-Cookie", [
        `WebsiteToken=deleted; Max-Age=0`,
        `AnotherCookieName=deleted; Max-Age=0`]
      );

      return {
        redirect: {
          permanent: false,
          destination: "/login"
        }
      }
    }

  }

  return {
    props: {},
  }
}

export default Home
