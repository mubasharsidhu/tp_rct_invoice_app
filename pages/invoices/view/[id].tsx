import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { InvoiceDetailContainer } from "../../../src/containers/InvoiceDetailContainer/InvoiceDetailContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";


export const ViewInvoice = () => {

  const router       = useRouter();
  const componentRef = useRef(null);
  const printHandler = useReactToPrint({
    content: () => componentRef.current,
  });

  const [isPrintAvailable, setIsPrintAvailable] = useState<boolean>(false);
  useEffect(()=>{
    const asPath = router.asPath.split('#');
    if (asPath[1] && asPath[1]==='print') {
      setTimeout(() => {
        setIsPrintAvailable(true);
      }, 1000);
    }
  }, [])

  if (isPrintAvailable) {
    printHandler();
  }

  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"View Invoice"}
        pageID={"invoice-detail-page"}
      >

        {<Button data-cy="printInvoice" id={"printInvoice"} variant="outlined" onClick={printHandler} size="small" sx={{px:4, mb:1}}>Print This Invoice</Button>}

        <InvoiceDetailContainer ref={componentRef} />
      </Layout>
    </AuthContextProvider>
  )

}


export default ViewInvoice;
