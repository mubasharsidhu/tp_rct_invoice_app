import { ReactNode } from "react";
import { Container } from "@mui/material";
import { Header } from "./Header";


type LayoutProps = {
  pageTitle: string,
  children?: ReactNode
}

const Layout = (props: LayoutProps ) => {

  return (
    <Container fixed>
      <Header />
      <h2>{props.pageTitle}</h2>
      {props.children}
    </Container>
  )

}

export default Layout;