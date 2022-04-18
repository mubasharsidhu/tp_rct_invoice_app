import { Divider, Grid, List, ListItem, ListItemText, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { InvalidUserTokenError, InvoiceAPI, InvoiceJobs, InvoiceValidationError } from "../../api/invoices";
import { useAuthContext } from "../../contexts/AuthContextProvider";
import { InvoiceForm as InvoiceForm, InvoiceInputParams } from "../../forms/InvoiceForm/InvoiceForm";
import { ClientResponseModel, getClientByIDHandler } from "../ClientDetailContainer/ClientDetailContainer";
import { getClientsHandler } from "../ClientTableContainer/ClientTableContainer";


type InvoiceFormContainerProps = {
  formType: "add" | "edit"
}

export const InvoiceFormContainer = (props: InvoiceFormContainerProps) => {
  const router                          = useRouter();
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
  const [selectedClientInfo, setSelectedClientInfo] = useState<ClientResponseModel | null>(null);

  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    // Get All Clients Starts here
    const clientsHandlerResponse = getClientsHandler({
      authUserToken: authUserToken,
      orderBy      : "clientName",
      order        : "asc",
      limit        : -1
    });
    clientsHandlerResponse.then((response) => {
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
        const responseClients = response.clients as ClientResponseModel[];

        let clientsOptions: Array<{ id: string, label: string }> | undefined = [];
        if ( responseClients != null ) {
          responseClients.map((data: ClientResponseModel) => {
            clientsOptions ? clientsOptions.push({ id: data.id, label: (data.name + ' (' + data.email + ')') }) : [];
          });
        }
        setErrorMessage(""); // resetting the error message if it was there before
        setAllClientsList(clientsOptions as { id: string, label: string }[]);
      }

    });
    // Get All Clients Ends here

  }, [authUserToken]);


  useEffect(() => {

    if ( authUserToken === null ) {
      return;
    }

    // Get Selected Client Detail Starts here
    if ( selectedClientID ) {
      const clientByIDHandlerResponse = getClientByIDHandler({
        authUserToken: authUserToken,
        clientID     : selectedClientID
      });
      clientByIDHandlerResponse.then((response) => {
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
          const responseClient = response.client as ClientResponseModel;
          setErrorMessage(""); // resetting the error message if it was there before
          setSelectedClientInfo(responseClient);
        }
      });
    }
    // Get Selected Client Detail Ends here

  }, [authUserToken, selectedClientID]);


  useEffect(() => {
    if ( authUserToken === null ) {
      return;
    }

    // Get Current Invoice Starts here
    if ( invoiceID !== undefined ) {

      const invoiceHandlerResponse = InvoiceJobs.getInvoiceByID({
        authUserToken: authUserToken,
        invoiceID    : invoiceID
      });

      invoiceHandlerResponse.then((response) => {
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
            id      : response.invoice?.id,
            clientID      : response.invoice?.client_id,
            invoiceDate   : response.invoice?.date,
            invoiceDueDate: response.invoice?.dueDate,
            invoiceNumber : response.invoice?.invoice_number,
            projectCode   : response.invoice?.projectCode,
            items         : response.invoice?.meta,
          }
          setErrorMessage(""); // resetting the error message if it was there before
          setCurrentInvoice(theInvoice as InvoiceInputParams);
        }
      })
    }
    // Get Current Invoice Ends here

  }, [authUserToken, invoiceID]);

  return (
    <>

      {
        selectedClientInfo
        ?
          <Grid container justifyContent="center" >
            <Grid item sm={12} md={8}>
              <Table
                aria-label="Company table" size="small"
                sx={{ mb:1, borderRadius: 1, backgroundColor: (theme) =>theme.palette.grey[200] }}
              >
                <TableBody>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                    <TableCell variant="head">Name:</TableCell><TableCell>{selectedClientInfo?.companyDetails.name}</TableCell>
                    <TableCell variant="head">Reg Number:</TableCell><TableCell>{selectedClientInfo?.companyDetails.regNumber}</TableCell>
                  </TableRow>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                    <TableCell variant="head">Tax Number:</TableCell><TableCell>{selectedClientInfo?.companyDetails.vatNumber}</TableCell>
                    <TableCell variant="head">Address:</TableCell><TableCell>{selectedClientInfo?.companyDetails.address}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>

          </Grid>
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


