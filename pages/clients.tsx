import type { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { ClientTable, getClientsHandler } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { ClientAPI, ClientResponseModel, InvalidUserTokenError } from '../src/api/clients'
import Layout from '../src/page-layout/Layout'
import { DEFAULT_ROWS_PER_PAGE } from './config/config'


export type searchOptionType = Array<string>;

type ClientPageProps = {
  clients      : ClientResponseModel[],
  total        : number,
  searchOptions: searchOptionType,
}

const subMenus: { label: string; url  : string; }[] = [{
  label: 'Add Client',
  url  : '/clients/add'
}];

const isSearchEnabled = true as boolean;


const ClientsPage: NextPage<ClientPageProps> = (props) => {

  return (
    <AuthContextProvider>

      <Layout
        pageTitle={"Clients"}
        subMenus={subMenus}
        isSearchEnabled={isSearchEnabled}
        searchOptions={props.searchOptions}
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

  const authUserToken = context.req.cookies.userToken as string;
  const { res }       = context;

  try {
    const clientResponse = await ClientAPI.getClients(authUserToken, {
      res,
      order  : "asc",
      orderBy: "clientName",
      limit  : DEFAULT_ROWS_PER_PAGE,
      offset : ( parseInt(context.query?.page as string, 10 ) - 1 ?? 1) * DEFAULT_ROWS_PER_PAGE
    });


    let searchOptions: searchOptionType = [];
    const clientsHandlerResponse = getClientsHandler({
      authUserToken: authUserToken,
      orderBy      : 'clientName',
      order        : 'asc',
      limit        : -1
    });

    await clientsHandlerResponse.then((response) => {

      if ( response.type === "success" ) {
        if ( response.clients ) {
          response.clients.map((data) => {
            if(!searchOptions.includes(data.name)){
              searchOptions.push(data.name)
            }
          });
        }
      }
      // else searchOptions is already set to [];

    });


    return {
      props: {
        clients      : JSON.parse(JSON.stringify(clientResponse.clients)),
        total        : JSON.parse(JSON.stringify(clientResponse.total)),
        searchOptions: JSON.parse(JSON.stringify(searchOptions))
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


