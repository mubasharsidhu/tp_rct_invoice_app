import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Box, Button, Step, StepLabel, Stepper, TextField } from "@mui/material";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

const SignupCompanySchema = yup.object({
  companyName     : yup.string().required(),
  companyAddress  : yup.string().required(),
  companyTaxNumber: yup.string().required(),
  companyRegNumber: yup.string().required(),
  iban            : yup.string(),
  swift           : yup.string(),
}).required();

export type SignupCompanyInputs = {
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
  iban            : string,
  swift           : string,
};

type SignupCompanyFormProps = {
  genericError?        : string;
  onSignupCompanySubmit: (data: SignupCompanyInputs) => unknown
}

export const SignupCompanyForm = (props: SignupCompanyFormProps) => {

  const { register, handleSubmit, formState: { errors } } = useForm<SignupCompanyInputs>({
    mode    : "onBlur",
    resolver: yupResolver(SignupCompanySchema)
  });

  const steps = [ 'Sign up', 'Company Details', 'Completed' ];

  return (
    <>
      <Box sx={{ mb:4 }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center' }} >
        <Box
          maxWidth="sm"
          component="form"
          noValidate
          onSubmit={handleSubmit(props.onSignupCompanySubmit)}
        >

          {props.genericError ? <ErrorMessage message={props.genericError} /> : null}

          <TextField
            id="companyName"
            name="companyName"
            label="Company Name"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyName", { required: true }) }}
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
            inputProps={{ ...register("companyAddress", { required: true }) }}
            error={!!errors.companyAddress}
            helperText={errors.companyAddress?.message ?? " "}
          />
          <TextField
            id="companyTaxNumber"
            name="companyTaxNumber"
            label="Company Tax Number"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyTaxNumber", { required: true }) }}
            error={!!errors.companyTaxNumber}
            helperText={errors.companyTaxNumber?.message ?? " "}
          />
          <TextField
            id="companyRegNumber"
            name="companyRegNumber"
            label="Company Reg Number"
            required={true}
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("companyRegNumber", { required: true }) }}
            error={!!errors.companyRegNumber}
            helperText={errors.companyRegNumber?.message ?? " "}
          />
          <TextField
            id="iban"
            name="iban"
            label="IBAN"
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("iban") }}
            error={!!errors.iban}
            helperText={errors.iban?.message ?? " "}
          />
          <TextField
            id="swift"
            name="swift"
            label="Swift"
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("swift") }}
            error={!!errors.swift}
            helperText={errors.swift?.message ?? " "}
          />

          <Button type="submit" fullWidth={true} variant="contained" >Submit Company</Button>

        </Box>
      </Box>
    </>
  )

}