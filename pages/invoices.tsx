import type { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { InvoiceAPI, InvoiceResponseModel, InvalidUserTokenError } from '../src/api/invoices'
import Layout from '../src/page-layout/Layout'
import { DEFAULT_ROWS_PER_PAGE } from '../src/config/config'
import { InvoiceTableContainer } from '../src/containers/InvoiceTableContainer/InvoiceTableContainer'
import type { GenericMenuItemProps } from '../src/components/Generic/GenericMenuItem'
import { Add } from '@mui/icons-material'


const subMenus: Array<GenericMenuItemProps> = [
  {
    title      : "Add Invoice",
    icon       : <Add fontSize="small" />,
    redirectURL: `/invoices/add`
  }
];


type InvoicesPageProps = {
  invoices: InvoiceResponseModel[],
  total   : number,
}

const InvoicesPage: NextPage<InvoicesPageProps> = (props) => {

  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"Invoices"}
        subMenus={subMenus}
        pageID="invoice-page"
        >
        <InvoiceTableContainer
          initialPayload={props}
          isMainPage={true}
        />
      </Layout>
    </AuthContextProvider>
  )

}


export const getServerSideProps: GetServerSideProps = async (context) => {

  const authUserToken = context.req.cookies.userToken as string;
  const { res }       = context;

  try {
    const invoiceResponse = await InvoiceAPI.getInvoices(authUserToken, {
      res,
      order  : "asc",
      orderBy: "clientName",
      limit  : DEFAULT_ROWS_PER_PAGE,
      offset : ( parseInt(context.query?.page as string, 10 ) - 1 ?? 1) * DEFAULT_ROWS_PER_PAGE
    });

    return {
      props: {
        invoices      : JSON.parse(JSON.stringify(invoiceResponse.invoices)),
        total        : JSON.parse(JSON.stringify(invoiceResponse.total)),
      }, // will be passed to the page component as props
    }

  } catch (err: unknown) {

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


export default InvoicesPage


