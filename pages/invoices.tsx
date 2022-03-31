import type { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { ClientTable } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { ClientAPI, ClientResponseModel, InvalidUserTokenError } from '../src/api/clients'
import Layout from '../src/page-layout/Layout'


type InvoicePageProps = {
  invoices: ClientResponseModel[],
  total: number
}


const InvoicesPage: NextPage<InvoicePageProps> = (props) => {

  return (
    <AuthContextProvider>

      <Layout pageTitle={"Invoices"}>

      </Layout>

    </AuthContextProvider>

  )

}



export default InvoicesPage
