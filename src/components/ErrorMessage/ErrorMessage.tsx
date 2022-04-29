import { Alert } from "@mui/material"


export type ErrorMessageProps = {
  message: string
}

export const ErrorMessage = (props: ErrorMessageProps) => {

  return (
    <Alert data-testid={`alert-error-message`} severity="error" sx={{ mb: 3 }} >{props.message}</Alert>
  )

}
