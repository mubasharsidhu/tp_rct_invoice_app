import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Box, Button, Step, StepLabel, Stepper, TextField } from "@mui/material";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { useEffect } from "react";


const SignupCompanySchema = yup.object({
  companyName     : yup.string().required("Company Name is a required field"),
  companyAddress  : yup.string().required("Company Address is a required field"),
  companyTaxNumber: yup.string().required("Tax Number is a required field"),
  companyRegNumber: yup.string().required("Reg Number is a required field"),
  iban            : yup.string().nullable().typeError("IBAN must be a valid string"),
  swift           : yup.string().nullable().typeError("Swift Code must be a valid string"),
});


export type SignupCompanyInputs = {
  companyName     : string,
  companyAddress  : string,
  companyTaxNumber: string,
  companyRegNumber: string,
  iban?           : string,
  swift?          : string,
};


type SignupCompanyFormProps = {
  genericError?        : string,
  formType             : "add" | "edit"
  currentData          : SignupCompanyInputs | undefined,
  onSignupCompanySubmit: (data: SignupCompanyInputs) => unknown
}

export const SignupCompanyForm = (props: SignupCompanyFormProps) => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignupCompanyInputs>({
    mode    : "onBlur",
    resolver: yupResolver(SignupCompanySchema)
  });

  useEffect(() => {
    reset(props.currentData);
  }, [props.currentData]);


  const steps = [ 'Sign up', 'Company Details', 'Completed' ];

  return (
    <>
      <Box sx={{ mb:4 }}>
        <Stepper activeStep={props.formType==="edit" ? 2 : 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center' }} >
        <Box
          id="signup-company-form"
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
            label="Tax Number"
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
            label="Reg Number"
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
            label="Swift Code"
            fullWidth={true}
            margin="dense"
            inputProps={{ ...register("swift") }}
            error={!!errors.swift}
            helperText={errors.swift?.message ?? " "}
          />

          <Button type="submit" fullWidth={true} variant="contained" id="signup-company-button" >Submit Company</Button>

        </Box>
      </Box>
    </>
  )

}
