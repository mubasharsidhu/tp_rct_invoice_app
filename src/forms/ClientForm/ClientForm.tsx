import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Button, TextField } from "@mui/material";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { useEffect } from "react";


const ClientSchema = yup.object({
  clientName      : yup.string().required("Client Name is a required field"),
  email           : yup.string().email("Email must be a valid email").required("Email is a required field"),
  companyName     : yup.string().required("Company Name is a required field"),
  companyAddress  : yup.string().required("Company Address is a required field"),
  companyTaxNumber: yup.string().required("Tax Number is a required field"),
  companyRegNumber: yup.string().required("Reg Number is a required field"),
}).required();


export type ClientInputParams = {
  id?             : string,
  clientName      : string,
  email           : string,
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
}


export type ClientFormProps = {
  genericError?            : string
  currentClient?           : ClientInputParams | undefined
  onClientDataSubmitRequest: (data: ClientInputParams) => unknown
}


export const ClientForm = (props: ClientFormProps) => {

  const { register, reset, handleSubmit, formState: { errors } } = useForm<ClientInputParams>({
    mode         : "onBlur",
    resolver     : yupResolver(ClientSchema),
  });

  useEffect(() => {
    reset(props.currentClient);
  }, [props.currentClient]);


  return (
    <>
      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center' }} >
        <Box
          maxWidth="sm"
          component="form"
          noValidate
          onSubmit={handleSubmit(props.onClientDataSubmitRequest)}
        >
          {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

          <TextField
            id="clientName"
            name="clientName"
            label="Client Name"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("clientName", { required: true }) }}
            error={!!errors.clientName}
            helperText={errors.clientName?.message ?? " "}
          />

          <TextField
            id="email"
            name="email"
            label="Email"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("email", { required: true })}}
            error={!!errors.email}
            helperText={errors.email?.message ?? " "}
          />

          <TextField
            id="companyName"
            name="companyName"
            label="Company Name"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyName", { required: true })}}
            error={!!errors.companyName}
            helperText={errors.companyName?.message ?? " "}
          />

          <TextField
            id="companyAddress"
            name="companyAddress"
            label="Company Address"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyAddress", { required: true })}}
            error={!!errors.companyAddress}
            helperText={errors.companyAddress?.message ?? " "}
          />

          <TextField
            id="companyTaxNumber"
            name="companyTaxNumber"
            label="Tax Number"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyTaxNumber", { required: true })}}
            error={!!errors.companyTaxNumber}
            helperText={errors.companyTaxNumber?.message ?? " "}
          />

          <TextField
            id="companyRegNumber"
            name="companyRegNumber"
            label="Reg Number"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyRegNumber", { required: true })}}
            error={!!errors.companyRegNumber}
            helperText={errors.companyRegNumber?.message ?? " "}
          />

          <Button type="submit" fullWidth={true} variant="contained" >Submit Client</Button>

        </Box>
      </Box>
    </>
  )

}
