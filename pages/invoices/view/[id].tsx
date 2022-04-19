import { Print } from "@mui/icons-material";
import React from "react";
import ReactToPrint from "react-to-print";
import type { GenericMenuItemProps } from "../../../src/components/Generic/GenericMenuItem";
import { InvoiceDetailContainer } from "../../../src/containers/InvoiceDetailContainer/InvoiceDetailContainer";
import { AuthContextProvider } from "../../../src/contexts/AuthContextProvider";
import Layout from "../../../src/page-layout/Layout";


const subMenus: Array<GenericMenuItemProps> = [
  {
    title      : "Print Invoice",
    icon       : <Print fontSize="small" />,
    redirectURL: `/invoices/print`
  }
];


export const ViewInvoice = () => {

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef<(() => void) | null>(null);

  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("Some cool text from the parent");

  const handleAfterPrint = React.useCallback(() => {
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    setLoading(true);
    setText("Loading new text...");

    return new Promise<void>((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);
  React.useEffect(() => {
    if (text === "New, Updated Text!" && typeof onBeforeGetContentResolve.current === "function") {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);


  const reactToPrintTrigger = React.useCallback(() => {
    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
    // to the root node of the returned component as it will be overwritten.

    // Bad: the `onClick` here will be overwritten by `react-to-print`
    // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

    // Good
    return <button>Print a Functional Component (using `forwardRef`) using a Functional Component</button>; // eslint-disable-line max-len
  }, []);

  return (
    <AuthContextProvider>
      <Layout
        pageTitle={"View Invoice"}
        subMenus={subMenus}
      >
        <ReactToPrint
          content={reactToPrintContent}
          documentTitle="AwesomeFileName"
          onAfterPrint={handleAfterPrint}
          onBeforeGetContent={handleOnBeforeGetContent}
          onBeforePrint={handleBeforePrint}
          removeAfterPrint
          trigger={reactToPrintTrigger}
            />

        <InvoiceDetailContainer ref={componentRef} />
      </Layout>
    </AuthContextProvider>
  )

}



export default ViewInvoice;
