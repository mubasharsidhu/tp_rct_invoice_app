import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { ClientJobs } from "../../api/clients";
import { InvalidUserTokenError, InvoiceAPI, InvoiceJobs, InvoiceValidationError } from "../../api/invoices";
import { ClientCompanyInfo } from "../../components/ClientCompanyInfo/ClientCompanyInfo";
import { ClientPropsModel } from "../../components/Clients/ClientDetail";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { InvoiceForm as InvoiceForm, InvoiceInputParams } from "../../forms/InvoiceForm/InvoiceForm";


type InvoiceFormContainerProps = {
  formType: "add" | "edit"
}

export const InvoiceFormContainer = (props: InvoiceFormContainerProps) => {
  const router                          = useRouter();
  const queryClientID                   = router.query.clientID;
  const invoiceID                       = router.query.id as string;
  const authUserToken                   = useAuthContext().authUserToken;
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  let defaultCurrentInvoice: InvoiceInputParams | undefined;
  if ( props.formType === "edit" ) {
    // This space in the first set of default values is necessary otherwise MUI do not set the CSS for defaultValue
    // and when useEffect fetches and return the new default values
    // the Label within the input and the defaultValue messes with eachother.
    defaultCurrentInvoice = {
      clientID      : ' ',
      invoiceDate   : new Date(),
      invoiceDueDate: new Date(),
      invoiceNumber : ' ',
      projectCode   : ' ',
      totalValue    : 0,
      items         : [{item: ' ', price: 0}]
    }
  }

  const [currentInvoice, setCurrentInvoice]         = useState<InvoiceInputParams | undefined>(defaultCurrentInvoice);
  const [allClientsList, setAllClientsList]         = useState<{ id: string, label: string }[] | undefined>(undefined);
  const [selectedClientID, setSelectedClientID]     = useState<string>("");
  const [selectedClientInfo, setSelectedClientInfo] = useState<ClientPropsModel | null>(null);

  useEffect(()=> {
    if (!queryClientID) {
      return;
    }
    setSelectedClientID(queryClientID as string);
  }, [queryClientID])


  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    let isEffectActive = true;

    // Get All Clients Starts here
    const clientsHandlerResponse = ClientJobs.getClients({
      authUserToken: authUserToken,
      orderBy      : "clientName",
      order        : "asc",
      limit        : -1
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
          const responseClients = response.clients as ClientPropsModel[];

          let clientsOptions: Array<{ id: string, label: string }> | undefined = [];
          if ( responseClients != null ) {
            responseClients.map((data: ClientPropsModel) => {
              clientsOptions ? clientsOptions.push({ id: data.id, label: (data.name + ' (' + data.email + ')') }) : [];
            });
          }
          setErrorMessage(""); // resetting the error message if it was there before
          setAllClientsList(clientsOptions as { id: string, label: string }[]);
        }
      }

    });

    clientsHandlerResponse.catch((err: unknown)=>{
      setErrorMessage("An Unknown error occured");
    });

    return () => { isEffectActive = false }
    // Get All Clients Ends here

  }, [authUserToken]);


  useEffect(() => {

    if ( authUserToken === null ) {
      return;
    }

    let isEffectActive = true;

    // Get Selected Client Detail Starts here
    if ( selectedClientID ) {
      const clientByIDHandlerResponse = ClientJobs.getClientByID({
        authUserToken: authUserToken,
        clientID     : selectedClientID
      });
      clientByIDHandlerResponse.then((response) => {
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
            const responseClient = response.client as ClientPropsModel;
            setErrorMessage(""); // resetting the error message if it was there before
            setSelectedClientInfo(responseClient);
          }
        }
      });

      clientByIDHandlerResponse.catch((err: unknown)=>{
        setErrorMessage("An Unknown error occured");
      });

    }
    // Get Selected Client Detail Ends here
    return () => { isEffectActive = false }

  }, [authUserToken, selectedClientID]);


  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    let isEffectActive = true;

    // Get Current Invoice Starts here
    if ( invoiceID !== undefined ) {

      const invoiceHandlerResponse = InvoiceJobs.getInvoiceByID({
        authUserToken: authUserToken,
        invoiceID    : invoiceID
      });

      invoiceHandlerResponse.then((response) => {
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
            const theInvoice = {
              id            : response.invoice?.id,
              clientID      : response.invoice?.client_id,
              invoiceDate   : response.invoice?.date,
              invoiceDueDate: response.invoice?.dueDate,
              invoiceNumber : response.invoice?.invoice_number,
              projectCode   : response.invoice?.projectCode,
              totalValue    : response.invoice?.value,
              items         : response.invoice?.meta,
            }
            setErrorMessage(""); // resetting the error message if it was there before
            setCurrentInvoice(theInvoice as InvoiceInputParams);
            setSelectedClientID(theInvoice.clientID as string);
          }
        }
      });

      invoiceHandlerResponse.catch((err: unknown)=>{
        setErrorMessage("An Unknown error occured");
      });

    }
    // Get Current Invoice Ends here

    return () => { isEffectActive = false }

  }, [authUserToken, invoiceID]);


  return (
    <>

      {
        selectedClientID && selectedClientInfo
        ?
          <ClientCompanyInfo selectedClientInfo={selectedClientInfo} />
        : null
      }

      <InvoiceForm
        genericError={errorMessage}
        allClientsList={allClientsList}
        setSelectedClientID={setSelectedClientID}
        selectedClientID={selectedClientID}
        currentInvoice={currentInvoice}
        onInvoiceDataSubmitRequest={ async (invoiceData: InvoiceInputParams) => {
          if (! authUserToken) {
            return;
          }

          try {

            let totalValue: number = 0;
            invoiceData.items.map((data: {item: string, price: number })=>{
              totalValue = totalValue + data.price;
            });

            invoiceData.totalValue = totalValue as number;

            const httpResponse = await InvoiceAPI.manageInvoice( authUserToken, props.formType, invoiceData );
            router.push("/invoices");

          } catch (err: unknown) {

            if ( err instanceof InvalidUserTokenError || err instanceof InvoiceValidationError ) {
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
