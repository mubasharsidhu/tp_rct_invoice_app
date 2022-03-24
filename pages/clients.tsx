import { Breadcrumbs, Link, Typography } from '@mui/material'
import type { NextPage } from 'next'
import React from 'react'
import { ClientTable } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { ClientDataProvider } from '../src/contexts/ClientDataProvider'
import NextLink from 'next/link';


const ClientsPage: NextPage = () => {

  return (
      <AuthContextProvider>
        <ClientDataProvider>
          <Breadcrumbs aria-label="breadcrumb">
            <NextLink href={'/'}>
              <Link underline="hover" color="inherit">
                MUI
              </Link>
            </NextLink>
            <Typography color="text.primary">Breadcrumbs</Typography>
          </Breadcrumbs>
          <ClientTable />
        </ClientDataProvider>
      </AuthContextProvider>
  )
}

export default ClientsPage
