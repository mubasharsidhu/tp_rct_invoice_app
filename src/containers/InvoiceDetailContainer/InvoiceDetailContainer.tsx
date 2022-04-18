import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { InvoiceAPI, InvalidInvoiceIDError, InvalidUserTokenError, InvoiceJobs, InvoiceResponseModel } from "../../api/invoices"
import { InvoiceDetail } from "../../components/Invoices/InvoiceDetail"
import { useAuthContext } from "../../contexts/AuthContextProvider"


/* export type InvoiceResponseModel = {

  client: {
    id            : string;
    name          : string;
    user_id       : string;
    email         : number;
    companyDetails: {
      name     : string;
      address  : string;
      vatNumber: string;
      regNumber: string;
    };
  },
  invoice: {
    client_id     : string;
    date  : string;
    dueDate: string;
    id: string;
    invoice_number: string;
    userIid: string;
    invoice_numbervalue: string;
  }

} */


export const InvoiceDetailContainer = () => {

  const router                              = useRouter();
  const authUserToken                       = useAuthContext().authUserToken;
  const invoiceID                           = router.query.id as string;
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceResponseModel | undefined>();
  const [errorMessage, setErrorMessage]     = useState<string | undefined>();

  useEffect(() => {
    if ( authUserToken === null || !invoiceID ) {
      return;
    }
    const invoicesHandlerResponse = InvoiceJobs.getInvoiceByID({
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
