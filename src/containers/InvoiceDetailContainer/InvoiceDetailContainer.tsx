import { Grid } from "@mui/material"
import { useRouter } from "next/router"
import React from "react"
import { useEffect, useState } from "react"
import { ClientJobs, ClientResponseModel } from "../../api/clients"
import { CommonJobs } from "../../api/common"
import { InvoiceJobs, InvoiceDetailResponseModel } from "../../api/invoices"
import { InvoiceDetail } from "../../components/Invoices/InvoiceDetail"
import { useAuthContext } from "../../contexts/AuthContextProvider"


export const InvoiceDetailContainer = React.forwardRef(( props, ref: React.Ref<HTMLDivElement> ) => {

  const router                                          = useRouter();
  const authUserToken                                   = useAuthContext().authUserToken;
  const invoiceID                                       = router.query.id as string;
  const [currentInvoice, setCurrentInvoice]             = useState<InvoiceDetailResponseModel | undefined>();
  const [currentInvoiceClient, setCurrentInvoiceClient] = useState<ClientResponseModel | undefined>();
  const [errorMessage, setErrorMessage]                 = useState<string | undefined>();

  useEffect(() => {
    if ( authUserToken === null || !invoiceID ) {
      return;
    }

    let isEffectActive = true;

    const invoicesHandlerResponse = InvoiceJobs.getInvoiceByID({
      authUserToken: authUserToken,
      invoiceID    : invoiceID
    });

    invoicesHandlerResponse.then((response) => {

      if (isEffectActive) {
        if ( response.type === "error" ) {
          if ( typeof response.error === 'string' ) {
            setErrorMessage(response.error);
          }
          else {
            const errorObj = response.error as object;
            setErrorMessage( errorObj.toString() );
          }
        }
        else {
          setErrorMessage(""); // resetting the error message if it was there before
          const theInvoice = response.invoice as InvoiceDetailResponseModel;
          setCurrentInvoice(theInvoice);
        }
      }

    });

    invoicesHandlerResponse.catch((err: unknown)=>{
      setErrorMessage("An Unknown error occured");
    });

    return () => { isEffectActive = false }

  }, [authUserToken, invoiceID]);


  useEffect(() => {
    if ( authUserToken === null || !currentInvoice?.client_id ) {
      return;
    }

    let isEffectActive = true;

    const clientID = currentInvoice.client_id;

    const clientsHandlerResponse = ClientJobs.getClientByID({
      authUserToken: authUserToken,
      clientID     : clientID
    });

    clientsHandlerResponse.then((response) => {

      if (isEffectActive) {
        if ( response.type === "error" ) {
          if ( typeof response.error === 'string' ) {
            setErrorMessage(response.error);
          }
          else {
            const errorObj = response.error as object;
            setErrorMessage( errorObj.toString() );
          }
        }
        else {
          setErrorMessage(""); // resetting the error message if it was there before
          setCurrentInvoiceClient(response.client as ClientResponseModel);
        }
      }

    });

    clientsHandlerResponse.catch((err: unknown)=>{
      setErrorMessage("An Unknown error occured");
    });

    return () => { isEffectActive = false }

  }, [authUserToken, currentInvoice?.client_id]);

  return (
    <Grid ref={ref}>

      <InvoiceDetail
        genericError={errorMessage}
        currentInvoice={currentInvoice}
        formatDate={CommonJobs.formatDate}
        currentInvoiceClient={currentInvoiceClient}
      />

    </Grid>
  )

})