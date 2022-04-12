import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InvoiceAPI, InvalidUserIDError, InvalidUserTokenError } from "../../api/invoices"
import { InvoiceDetail } from "../../components/Invoices/InvoiceDetail"
import { useAuthContext } from "../../contexts/AuthContextProvider"


export const getInvoiceByIDHandler = async (params: {
  authUserToken: string,
  invoiceID     : string
}) => {

  try {
    const invoiceResponse = await InvoiceAPI.getInvoicesByID(params.authUserToken, {
      invoiceID : params.invoiceID
    });

    return {
      type   : "success" as string,
      invoice: invoiceResponse.invoice as InvoiceResponseModel,
    }

  } catch (err: unknown) {

    return {
      type : "error" as string,
      error: err as InvalidUserTokenError | InvalidUserIDError
    }

  }

}


export type InvoiceResponseModel = {
  id            : string;
  email         : string;
  name          : string;
  totalBilled   : number;
  invoicesCount : number;
  companyDetails: {
    name     : string;
    address  : string;
    vatNumber: string;
    regNumber: string;
  };
}


export const InvoiceDetailContainer = () => {

  const router                            = useRouter();
  const authUserToken                     = useAuthContext().authUserToken;
  const invoiceID                          = router.query.id as string;
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceResponseModel | undefined>();
  const [errorMessage, setErrorMessage]   = useState<string | undefined>();

  useEffect(() => {
    if ( authUserToken === null || !invoiceID ) {
      return;
    }
    const invoicesHandlerResponse = getInvoiceByIDHandler({
      authUserToken: authUserToken,
      invoiceID     : invoiceID
    });

    invoicesHandlerResponse.then((response) => {

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
        setCurrentInvoice(response.invoice as InvoiceResponseModel);
      }

    })

  }, [authUserToken, invoiceID]);

  return (
    <>
      <InvoiceDetail
        genericError={errorMessage}
        currentInvoice={currentInvoice}
      />
    </>
  )
}
