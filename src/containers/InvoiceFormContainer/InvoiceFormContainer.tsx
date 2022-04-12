import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { InvoiceAPI, InvoiceValidationError } from "../../api/invoices";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { InvoiceForm as InvoiceForm, InvoiceInputParams } from "../../forms/InvoiceForm/InvoiceForm";
import { getInvoiceByIDHandler } from "../InvoiceDetailContainer/InvoiceDetailContainer";


type InvoiceFormContainerProps = {
  formType: "add" | "edit"
}

export const InvoiceFormContainer = (props: InvoiceFormContainerProps) => {
  const router                          = useRouter();
  const authUserToken                   = useAuthContext().authUserToken;
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const invoiceID                        = router.query.id as string;

  let defaultCurrentInvoice: InvoiceInputParams | undefined;
  if ( props.formType === "edit" ) {
    // This space in the first set of default values is necessary otherwise MUI do not set the CSS for defaultValue
    // and when useEffect fetches and return the new default values
    // the Label within the input and the defaultValue messes with eachother.
    defaultCurrentInvoice = {
      id              : ' ',
      invoiceName      : ' ',
      email           : ' ',
      companyName     : ' ',
      companyAddress  : ' ',
      companyTaxNumber: ' ',
      companyRegNumber: ' '
    }
  }

  const [currentInvoice, setCurrentInvoice] = useState<InvoiceInputParams | undefined>(defaultCurrentInvoice);

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
        const theInvoice = {
          id              : response.invoice?.id,
          invoiceName      : response.invoice?.name,
          email           : response.invoice?.email,
          companyName     : response.invoice?.companyDetails.name,
          companyAddress  : response.invoice?.companyDetails.address,
          companyTaxNumber: response.invoice?.companyDetails.vatNumber,
          companyRegNumber: response.invoice?.companyDetails.regNumber
        }
        setErrorMessage(""); // resetting the error message if it was there before
        setCurrentInvoice(theInvoice as InvoiceInputParams);
      }

    })

  }, [authUserToken, invoiceID]);

  return (
    <>
      <InvoiceForm
        genericError={errorMessage}
        currentInvoice={currentInvoice}
        onInvoiceDataSubmitRequest={ async (invoiceData) => {

          if (! authUserToken) {
            return;
          }

          try {

            const httpResponse = await InvoiceAPI.manageInvoice( authUserToken, props.formType, invoiceData );
            router.push("/invoices");

          } catch (err: unknown) {

            if ( err instanceof InvoiceValidationError ) {
              if ( typeof err === 'string' ) {
                setErrorMessage(err);
              }
              else {
                setErrorMessage(err.toString());
              }
            }

          }

        }}

      />
    </>
  )
}


