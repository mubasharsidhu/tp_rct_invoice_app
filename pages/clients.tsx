import { Breadcrumbs, Link, Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { ClientTable } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { ClientDataProvider } from '../src/contexts/ClientDataProvider'
import NextLink from 'next/link';
import { ClientAPI, ClientResponseModel, InvalidUserTokenError } from '../src/api/clients'
import Layout from '../src/page-layout/Layout'


type ClientPageProps = {
  clients: ClientResponseModel[],
  total: number
}


const ClientsPage: NextPage<ClientPageProps> = (props) => {

  return (
    <AuthContextProvider>

      <Layout pageTitle={"Clients"}>
        <ClientTable initialPayload={props} />
      </Layout>

    </AuthContextProvider>

  )

}


export const getServerSideProps: GetServerSideProps = async (context) => {

  const userAuthToken  = context.req.cookies.userToken as string;
  const { res }        = context;
  const EnvRowsPerPage = process.env.NEXT_PUBLIC_ROWS_PER_PAGE ? parseInt(process.env.NEXT_PUBLIC_ROWS_PER_PAGE) : 10;

  try {

    const clientResponse = await ClientAPI.getClients(userAuthToken, {
      res,
      order: "asc",
      orderBy: "email",
      limit: EnvRowsPerPage,
      offset: ( parseInt(context.query?.page as string, 10 ) - 1 ?? 1) * 2
    })

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


export default ClientsPage
