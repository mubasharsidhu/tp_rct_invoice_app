import { ClientResponseModel } from "../../containers/ClientDetailContainer/ClientDetailContainer"
import { ErrorMessage } from "../ErrorMessage/ErrorMessage"

type ClientDetailProps = {
  genericError?            : string
  currentClient?           : ClientResponseModel | undefined
}

export const ClientDetail = (props: ClientDetailProps) => {
  console.log(props.currentClient)
  return (
    <>
      {props.genericError ? <ErrorMessage message={props.genericError} /> : null}
    </>
  )
}
