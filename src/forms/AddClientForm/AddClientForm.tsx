import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ErrorMessage } from "../../containers/ClientTableContainer/ClientTableContainer";
import { Button, TextField } from "@mui/material";


const AddClientSchema = yup.object({
  clientName      : yup.string().required(),
  email           : yup.string().email().required(),
  companyName     : yup.string().required(),
  companyAddress  : yup.string().required(),
  companyTaxNumber: yup.string().required(),
  companyRegNumber: yup.string().required(),
}).required();


export type ClientInputs = {
  clientName      : string,
  email           : string,
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
}


export type AddClientFormProps = {
  genericError? : string
  onClientDataSubmitRequest: (data: ClientInputs) => unknown
}


export const AddClientForm = (props: AddClientFormProps) => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ClientInputs>({
    mode: "onBlur",
    resolver: yupResolver(AddClientSchema)
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex-1 max-w-xl bg-white shadow-2xl rounded-lg p-8">
        {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

        <form className="flex flex-col" onSubmit={handleSubmit(props.onClientDataSubmitRequest)}>

          <TextField
            margin="dense"
            id="clientName"
            label="Client Name"
            inputProps={{ ...register("clientName", { required: true })}}
            error={!!errors.clientName}
            helperText={errors.clientName?.message ?? " "}
          />

          <TextField
            margin="dense"
            id="email"
            label="Email"
            inputProps={{ ...register("email", { required: true })}}
            error={!!errors.email}
            helperText={errors.email?.message ?? " "}
          />

          <TextField
            margin="dense"
            id="companyName"
            label="Company Name"
            inputProps={{ ...register("companyName", { required: true })}}
            error={!!errors.companyName}
            helperText={errors.companyName?.message ?? " "}
          />

          <TextField
            margin="dense"
            id="companyAddress"
            label="Company Address"
            inputProps={{ ...register("companyAddress", { required: true })}}
            error={!!errors.companyAddress}
            helperText={errors.companyAddress?.message ?? " "}
          />

          <TextField
            margin="dense"
            id="companyTaxNumber"
            label="Company Tax Number"
            inputProps={{ ...register("companyTaxNumber", { required: true })}}
            error={!!errors.companyTaxNumber}
            helperText={errors.companyTaxNumber?.message ?? " "}
          />

          <TextField
            margin="dense"
            id="companyRegNumber"
            label="Company Reg Number"
            inputProps={{ ...register("companyRegNumber", { required: true })}}
            error={!!errors.companyRegNumber}
            helperText={errors.companyRegNumber?.message ?? " "}
          />

          <div className="flex justify-between">
            <Button type="submit" variant="contained">Create Client</Button>
          </div>

        </form>
      </div>
    </div>
  )
}
