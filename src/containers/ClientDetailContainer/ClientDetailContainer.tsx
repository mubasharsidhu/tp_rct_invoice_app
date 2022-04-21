import { Add } from "@mui/icons-material"
import { Button, Grid, Stack, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ClientJobs, ClientResponseModel } from "../../api/clients"
import { ClientDetail } from "../../components/Clients/ClientDetail"
import { useAuthContext } from "../../contexts/AuthContextProvider"
import { InvoiceTableContainer } from "../InvoiceTableContainer/InvoiceTableContainer"


export const ClientDetailContainer = () => {

  const router                            = useRouter();
  const authUserToken                     = useAuthContext().authUserToken;
  const clientID                          = router.query.id as string;
  const [currentClient, setCurrentClient] = useState<ClientResponseModel | undefined>();
  const [errorMessage, setErrorMessage]   = useState<string | undefined>();

  const [invoicesCount, setInvoicesCount] = useState<number | undefined>(0);
  const [totalBilled, setTotalBilled]     = useState<number | undefined>(0);

  useEffect(() => {
    if ( authUserToken === null || !clientID ) {
      return;
    }

    let isEffectActive = true;

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
          setCurrentClient(response.client as ClientResponseModel);
        }
      }

    });

    clientsHandlerResponse.catch((err: unknown)=>{
      setErrorMessage("An Unknown error occured");
    });

    return () => { isEffectActive = false }

  }, [authUserToken, clientID]);


  return (
    <>
      <ClientDetail
        genericError={errorMessage}
        currentClient={currentClient}
        invoicesCount={invoicesCount}
      />

      <Grid container spacing={2} sx={{py:1, mt:1}}>
        <Grid item>
          <Typography component="h1" variant="h4">Recent Invoices</Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={()=>{ router.push(`/invoices/add?clientID=${clientID}`)}} >
              <Add fontSize="small" />Add Invoice
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <InvoiceTableContainer
        clientID={clientID}
        setInvoicesCount={setInvoicesCount}
      />
    </>
  )
}
