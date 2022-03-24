import type { NextPage } from 'next'
import React from 'react'
import { ClientTable } from '../src/containers/ClientTableContainer/ClientTableContainer'
import { LogoutButtonWrapper } from '../src/containers/LogoutButton/LogoutButton'
import { AuthContextProvider } from '../src/contexts/AuthContextProvider'
import { ClientDataProvider } from '../src/contexts/ClientDataProvider'


const MainNavigation = () => {
  return (
    <>
      <LogoutButtonWrapper />
    </>
  )
}


const Home: NextPage = () => {
  return (
    <AuthContextProvider>
      <ClientDataProvider>
        <MainNavigation/>
        <ClientTable />
      </ClientDataProvider>
    </AuthContextProvider>
  )
}

export default Home
