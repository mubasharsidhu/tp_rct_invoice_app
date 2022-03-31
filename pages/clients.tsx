import type { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { ClientTable } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { ClientAPI, ClientResponseModel, InvalidUserTokenError } from '../src/api/clients'
import Layout from '../src/page-layout/Layout'
import { DEFAULT_ROWS_PER_PAGE } from './config/config'


type ClientPageProps = {
  clients: ClientResponseModel[],
  total: number
}

const subMenus: { label: string; url  : string; }[] = [{
  label: 'Add Client',
  url  : '/clients/add'
}];

const ClientsPage: NextPage<ClientPageProps> = (props) => {

  return (
    <AuthContextProvider>

      <Layout
        pageTitle={"Clients"}
        subMenus={subMenus}
        >
        <ClientTable
          initialPayload={props}
          pagination={true}
        />
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
      order: "asc",
      orderBy: "clientName",
      limit: DEFAULT_ROWS_PER_PAGE,
      offset: ( parseInt(context.query?.page as string, 10 ) - 1 ?? 1) * DEFAULT_ROWS_PER_PAGE
    })

    return {
      props: {
        clients: JSON.parse(JSON.stringify(clientResponse.clients)),
        total: JSON.parse(JSON.stringify(clientResponse.total))
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
